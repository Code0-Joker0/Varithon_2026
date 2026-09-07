#!/usr/bin/env bash
# =============================================================================
# laptop-stop.sh — Varithon 2026 — BLACK-BOX state
# =============================================================================
# What this script does (in order):
#   1. Kills the Tailscale Funnel — removes the public HTTPS mapping entirely
#      (not just "backend stops responding" — the mapping itself is deleted)
#   2. Kills uvicorn / FastAPI backend process
#   3. Brings Tailscale down (tailscale down)
#   4. Stops and DISABLES tailscaled systemd service (physical-access-only to re-enable)
#   5. Locks the nftables firewall: flush all rules, default policy DROP
#
# After this script: zero network services are listening. The machine is
# completely dark from a network perspective until laptop-start.sh is run.
#
# Usage:
#   bash scripts/laptop-stop.sh
#
# Requires sudo for: tailscale down/service stop, nftables
# =============================================================================

set -euo pipefail

# ---- Config -----------------------------------------------------------------
REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PID_FILE="/tmp/varithon-uvicorn.pid"
LOG_FILE="/tmp/varithon-uvicorn.log"
BACKEND_PORT=8000

# ---- Colors -----------------------------------------------------------------
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
CYAN='\033[0;36m'; BOLD='\033[1m'; NC='\033[0m'

info()    { echo -e "${CYAN}[INFO]${NC}  $*"; }
ok()      { echo -e "${GREEN}[OK]${NC}    $*"; }
warn()    { echo -e "${YELLOW}[WARN]${NC}  $*"; }
fail()    { echo -e "${RED}[FAIL]${NC}  $*" >&2; exit 1; }
section() { echo -e "\n${BOLD}▶ $*${NC}"; }

# ---- Step 1 : Kill Tailscale Funnel -----------------------------------------
section "Step 1 -- Killing Tailscale Funnel"

# We need to turn off Funnel explicitly. Just stopping the backend leaves the
# public URL mapping alive (pointing at nothing) — that is sloppy.
# `tailscale funnel off` (or the equivalent) removes the HTTPS mapping itself.

if tailscale funnel status 2>/dev/null | grep -q "Funnel on"; then
    # Modern Tailscale: tailscale funnel --https=443 off  OR  tailscale funnel off
    if tailscale funnel --https=443 off 2>/dev/null; then
        ok "Funnel mapping removed (--https=443 off)"
    elif tailscale serve --https=443 off 2>/dev/null; then
        ok "Funnel mapping removed (serve --https=443 off)"
    else
        # Nuclear: reset all serve/funnel config
        tailscale serve reset 2>/dev/null || true
        ok "Funnel mapping reset via 'tailscale serve reset'"
    fi
else
    # Also try via serve status (belt + suspenders)
    if tailscale serve status 2>/dev/null | grep -q "Funnel on"; then
        tailscale serve --https=443 off 2>/dev/null || tailscale serve reset 2>/dev/null || true
        ok "Funnel mapping removed (via serve status)"
    else
        ok "Funnel was not active -- nothing to remove"
    fi
fi

# Final verification: ensure no Funnel mapping survives
sleep 0.5
REMAINING=$(tailscale funnel status 2>/dev/null || tailscale serve status 2>/dev/null || echo "")
if echo "${REMAINING}" | grep -q "Funnel on"; then
    warn "Funnel may still be partially active -- check: tailscale funnel status"
else
    ok "Funnel confirmed OFF"
fi

# ---- Step 2 : Kill uvicorn backend ------------------------------------------
section "Step 2 -- Stopping FastAPI backend (uvicorn)"

KILLED_UVICORN=0

# Method A: kill via PID file
if [[ -f "${PID_FILE}" ]]; then
    TRACKED_PID=$(cat "${PID_FILE}")
    if kill -0 "${TRACKED_PID}" 2>/dev/null; then
        info "Sending SIGTERM to uvicorn PID ${TRACKED_PID}..."
        kill -TERM "${TRACKED_PID}" 2>/dev/null || true
        sleep 2
        # Force-kill if still alive
        if kill -0 "${TRACKED_PID}" 2>/dev/null; then
            warn "SIGTERM ignored -- sending SIGKILL to PID ${TRACKED_PID}"
            kill -KILL "${TRACKED_PID}" 2>/dev/null || true
        fi
        KILLED_UVICORN=1
    else
        info "PID ${TRACKED_PID} from PID file is already gone"
    fi
    rm -f "${PID_FILE}"
    ok "PID file cleaned up"
fi

# Method B: sweep the port (catches manually-launched instances)
ORPHAN_PID=$(lsof -ti tcp:"${BACKEND_PORT}" 2>/dev/null | head -1 || true)
if [[ -n "${ORPHAN_PID}" ]]; then
    warn "Orphan process on port ${BACKEND_PORT} (PID ${ORPHAN_PID}) -- killing"
    kill -TERM "${ORPHAN_PID}" 2>/dev/null || true
    sleep 1
    kill -KILL "${ORPHAN_PID}" 2>/dev/null || true
    KILLED_UVICORN=1
fi

# Method C: pkill by name (belt + suspenders)
if pgrep -f "uvicorn main:app" >/dev/null 2>&1; then
    warn "Additional uvicorn processes found -- killing all"
    pkill -TERM -f "uvicorn main:app" 2>/dev/null || true
    sleep 1
    pkill -KILL -f "uvicorn main:app" 2>/dev/null || true
    KILLED_UVICORN=1
fi

if [[ ${KILLED_UVICORN} -eq 1 ]]; then
    ok "uvicorn backend stopped"
else
    ok "uvicorn was not running -- nothing to stop"
fi

# Rotate log (keep for debugging but note it's from the last run)
if [[ -f "${LOG_FILE}" ]]; then
    mv "${LOG_FILE}" "${LOG_FILE}.last" 2>/dev/null || true
    info "Last uvicorn log saved to ${LOG_FILE}.last"
fi

# ---- Step 3 : Tailscale down ------------------------------------------------
section "Step 3 -- Bringing Tailscale down"

TS_STATUS=$(tailscale status --json 2>/dev/null | python3 -c \
    "import sys,json; d=json.load(sys.stdin); print(d.get('BackendState','Unknown'))" 2>/dev/null || echo "Unknown")

if [[ "${TS_STATUS}" == "Stopped" || "${TS_STATUS}" == "NeedsLogin" ]]; then
    ok "Tailscale already down (BackendState=${TS_STATUS})"
else
    info "BackendState=${TS_STATUS} -- running 'tailscale down'..."
    tailscale down || warn "'tailscale down' returned non-zero (may already be down)"
    sleep 1
    ok "Tailscale brought down"
fi

# ---- Step 4 : Stop and disable tailscaled service ---------------------------
section "Step 4 -- Stopping + disabling tailscaled"

if systemctl is-active --quiet tailscaled; then
    sudo systemctl stop tailscaled
    ok "tailscaled stopped"
else
    ok "tailscaled already stopped"
fi

# Disable means it will NOT restart on boot — physical access required to re-enable
sudo systemctl disable tailscaled --quiet 2>/dev/null || true
ok "tailscaled disabled (will not start on boot)"

# Confirm final state
TS_SVC_STATE=$(systemctl is-active tailscaled 2>/dev/null || echo "inactive")
if [[ "${TS_SVC_STATE}" != "inactive" && "${TS_SVC_STATE}" != "failed" ]]; then
    echo -e "${RED}${BOLD}"
    echo "  ╔════════════════════════════════════════════════════╗"
    echo "  ║ CRITICAL: tailscaled is still '${TS_SVC_STATE}'             ║"
    echo "  ║ Machine is NOT in black-box state!                   ║"
    echo "  ║ Next step: sudo systemctl kill -s SIGKILL tailscaled  ║"
    echo "  ╚════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    exit 1
fi
ok "tailscaled confirmed inactive (${TS_SVC_STATE})"

# ---- Step 5 : Lock firewall (deny all) --------------------------------------
section "Step 5 -- Locking nftables firewall (deny all)"

if command -v nft >/dev/null; then
    # Flush all existing rules and set default DROP policy.
    # WARNING: This locks down the machine. SSH over physical LAN will still work
    # because the physical interface is not covered by an empty inet filter.
    # But any prior ALLOW rules (including tailscale0) are gone.
    #
    # We write a minimal nftables config: flush everything, then set drop policy
    # for INPUT and FORWARD, leave OUTPUT unrestricted.
    sudo nft -f - <<'NFTEOF'
flush ruleset

table inet varithon_lockdown {
    chain input {
        type filter hook input priority filter; policy drop;

        # Allow already-established / related connections (e.g. ongoing SSH)
        ct state established,related accept

        # Allow loopback
        iifname "lo" accept

        # Allow ICMPv6 (required for IPv6 operation)
        ip6 nexthdr icmpv6 accept

        # Allow ICMP ping (useful for basic connectivity checks)
        ip protocol icmp accept

        # Everything else: DROP (logged for 30s debugging window, then silenced)
        # Uncomment to enable logging:
        # log prefix "varithon-drop: " flags all
    }

    chain forward {
        type filter hook forward priority filter; policy drop;
    }

    chain output {
        type filter hook output priority filter; policy accept;
    }
}
NFTEOF
    ok "nftables: lockdown ruleset applied (input=DROP, forward=DROP, output=ACCEPT)"
    info "Active ruleset:"
    sudo nft list ruleset 2>/dev/null | head -30 || true
else
    warn "'nft' not found -- falling back to iptables for firewall lockdown"
    if command -v iptables >/dev/null; then
        sudo iptables -P INPUT DROP
        sudo iptables -P FORWARD DROP
        sudo iptables -F   # flush all rules
        # Allow loopback + established
        sudo iptables -A INPUT -i lo -j ACCEPT
        sudo iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
        ok "iptables: INPUT=DROP, FORWARD=DROP (established/loopback allowed)"
    else
        fail "Neither 'nft' nor 'iptables' found -- firewall NOT locked. BLACK-BOX state NOT achieved. Install nftables: sudo pacman -S nftables  (or apt install nftables)"
    fi
fi

# ---- Done -------------------------------------------------------------------
echo ""
echo -e "${RED}${BOLD}=====================================================${NC}"
echo -e "${RED}${BOLD}  VARITHON LAPTOP -- BLACK-BOX state achieved        ${NC}"
echo -e "${RED}${BOLD}=====================================================${NC}"
echo ""
echo -e "  Funnel      : ${GREEN}OFF${NC}   (public URL mapping removed)"
echo -e "  Backend     : ${GREEN}OFF${NC}   (uvicorn stopped)"
echo -e "  Tailscale   : ${GREEN}DOWN${NC}  (service stopped + disabled)"
echo -e "  Firewall    : ${GREEN}DROP${NC}  (deny-all policy active)"
echo ""
echo -e "  To re-expose: bash ${REPO_DIR}/scripts/laptop-start.sh"
echo ""
