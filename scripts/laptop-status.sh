#!/usr/bin/env bash
# =============================================================================
# laptop-status.sh — Varithon 2026 — system status snapshot
# =============================================================================
# Prints a clear, colour-coded report of every service component:
#   - tailscaled (systemd service)
#   - Tailscale network state + Funnel mapping
#   - uvicorn / FastAPI backend (port + health endpoint + PID)
#   - nftables / firewall summary
#
# Reads as "EXPOSED" if everything is running and Funnel is live.
# Reads as "BLACK BOX" if all services are down and firewall is locked.
# Reports "PARTIAL" for anything in between (leftover state = worth investigating).
#
# Usage:
#   bash scripts/laptop-status.sh
# =============================================================================

set -uo pipefail    # no -e: we want to keep going even if one check fails

# ---- Config -----------------------------------------------------------------
PID_FILE="/tmp/varithon-uvicorn.pid"
BACKEND_PORT=8000
FUNNEL_URL="https://terminalhack.tail92f130.ts.net"

# ---- Colors -----------------------------------------------------------------
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
CYAN='\033[0;36m'; BOLD='\033[1m'; DIM='\033[2m'; NC='\033[0m'

tick()  { echo -e "  ${GREEN}✓${NC}  $*"; }
cross() { echo -e "  ${RED}✗${NC}  $*"; }
dash()  { echo -e "  ${YELLOW}~${NC}  $*"; }
info()  { echo -e "  ${DIM}    $*${NC}"; }

# Score counters: exposed_count = services that are UP
EXPOSED=0
DARK=0

# ---- Header -----------------------------------------------------------------
echo ""
echo -e "${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BOLD}${CYAN}   Varithon 2026 — Laptop Status Snapshot                  ${NC}"
echo -e "${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "  Timestamp : $(date '+%Y-%m-%d %H:%M:%S %Z')"
echo ""

# ---- 1. tailscaled systemd service ------------------------------------------
echo -e "${BOLD}[1] tailscaled service${NC}"

SVC_STATE=$(systemctl is-active tailscaled 2>/dev/null || echo "inactive")
SVC_ENABLED=$(systemctl is-enabled tailscaled 2>/dev/null || echo "disabled")

if [[ "${SVC_STATE}" == "active" ]]; then
    tick "tailscaled is running"
    EXPOSED=$((EXPOSED+1))
    info "Enabled on boot: ${SVC_ENABLED}"
    # Show uptime
    SVC_SINCE=$(systemctl show tailscaled --property=ActiveEnterTimestamp --value 2>/dev/null | sed 's/ [A-Z]*$//' || echo "?")
    info "Active since    : ${SVC_SINCE}"
else
    cross "tailscaled is ${SVC_STATE}"
    DARK=$((DARK+1))
    info "Enabled on boot: ${SVC_ENABLED}"
fi
echo ""

# ---- 2. Tailscale network state ---------------------------------------------
echo -e "${BOLD}[2] Tailscale network${NC}"

if command -v tailscale >/dev/null 2>&1; then
    TS_JSON=$(tailscale status --json 2>/dev/null || echo '{}')
    TS_BACKEND=$(echo "${TS_JSON}" | python3 -c \
        "import sys,json; d=json.load(sys.stdin); print(d.get('BackendState','Unknown'))" 2>/dev/null || echo "Unknown")
    TS_NAME=$(echo "${TS_JSON}" | python3 -c \
        "import sys,json; d=json.load(sys.stdin); print(d.get('Self',{}).get('DNSName','?').rstrip('.'))" 2>/dev/null || echo "?")
    TS_IP=$(echo "${TS_JSON}" | python3 -c \
        "import sys,json
d=json.load(sys.stdin)
ips=d.get('Self',{}).get('TailscaleIPs',[])
print(ips[0] if ips else '?')" 2>/dev/null || echo "?")

    if [[ "${TS_BACKEND}" == "Running" ]]; then
        tick "Tailscale up (BackendState=Running)"
        EXPOSED=$((EXPOSED+1))
        info "Node DNS  : ${TS_NAME}"
        info "Tailnet IP: ${TS_IP}"
    else
        cross "Tailscale not running (BackendState=${TS_BACKEND})"
        DARK=$((DARK+1))
    fi
else
    cross "tailscale binary not found"
    DARK=$((DARK+1))
fi
echo ""

# ---- 3. Tailscale Funnel status ---------------------------------------------
echo -e "${BOLD}[3] Tailscale Funnel${NC}"

FUNNEL_RAW=$(tailscale funnel status 2>/dev/null || tailscale serve status 2>/dev/null || echo "")

if echo "${FUNNEL_RAW}" | grep -q "Funnel on"; then
    tick "Funnel is ACTIVE"
    EXPOSED=$((EXPOSED+1))
    info "Public URL : ${FUNNEL_URL}"

    # Show the proxy mapping (what port is being forwarded)
    PROXY_LINE=$(echo "${FUNNEL_RAW}" | grep "proxy" | head -1 || echo "")
    if [[ -n "${PROXY_LINE}" ]]; then
        info "Mapping    : ${PROXY_LINE}"
    fi

    # Attempt a quick external reachability probe (best-effort, non-fatal)
    if curl -sf --max-time 5 "${FUNNEL_URL}/health" >/dev/null 2>&1; then
        info "External /health: ${GREEN}reachable${NC}"
    else
        dash "External /health probe timed out (may be normal if backend is down)"
    fi
elif [[ -z "${FUNNEL_RAW}" ]]; then
    cross "Funnel status unavailable (tailscaled may be stopped)"
    DARK=$((DARK+1))
else
    cross "Funnel is OFF"
    DARK=$((DARK+1))
fi
echo ""

# ---- 4. uvicorn / FastAPI backend -------------------------------------------
echo -e "${BOLD}[4] FastAPI backend (uvicorn:${BACKEND_PORT})${NC}"

BACKEND_RUNNING=0

# Check PID file
if [[ -f "${PID_FILE}" ]]; then
    TRACKED_PID=$(cat "${PID_FILE}")
    if kill -0 "${TRACKED_PID}" 2>/dev/null; then
        tick "uvicorn running (PID file: ${TRACKED_PID})"
        BACKEND_RUNNING=1
    else
        dash "PID file exists (${TRACKED_PID}) but process is gone -- stale file"
    fi
fi

# Check port directly (catches manually-launched instances)
PORT_PID=$(lsof -ti tcp:"${BACKEND_PORT}" 2>/dev/null | head -1 || true)
if [[ -n "${PORT_PID}" ]]; then
    if [[ ${BACKEND_RUNNING} -eq 0 ]]; then
        tick "Something listening on port ${BACKEND_PORT} (PID ${PORT_PID})"
        BACKEND_RUNNING=1
    else
        info "Port ${BACKEND_PORT} held by PID ${PORT_PID}"
    fi
fi

# Health check
if [[ ${BACKEND_RUNNING} -eq 1 ]]; then
    HEALTH=$(curl -sf --max-time 3 "http://127.0.0.1:${BACKEND_PORT}/health" 2>/dev/null || echo "FAIL")
    if [[ "${HEALTH}" == *"ok"* ]]; then
        tick "Health endpoint: ${HEALTH}"
        EXPOSED=$((EXPOSED+1))
    else
        dash "Health endpoint: not responding (process may still be starting)"
    fi
else
    cross "uvicorn is not running on port ${BACKEND_PORT}"
    DARK=$((DARK+1))
fi

# Show tail of uvicorn log
LOG_FILE="/tmp/varithon-uvicorn.log"
LAST_LOG="${LOG_FILE}.last"
if [[ -f "${LOG_FILE}" ]]; then
    echo ""
    info "Last 5 lines of ${LOG_FILE}:"
    tail -5 "${LOG_FILE}" 2>/dev/null | while IFS= read -r line; do
        info "  ${line}"
    done
elif [[ -f "${LAST_LOG}" ]]; then
    info "Active log not found; showing last run (${LAST_LOG}):"
    tail -3 "${LAST_LOG}" 2>/dev/null | while IFS= read -r line; do
        info "  ${line}"
    done
fi
echo ""

# ---- 5. Firewall (nftables) summary -----------------------------------------
echo -e "${BOLD}[5] Firewall (nftables)${NC}"

if command -v nft >/dev/null 2>&1; then
    # Use -n (non-interactive, never prompt for password).
    # Falls back to passwordless read attempt, then marks unavailable.
    NFT_RULES=$(sudo -n nft list ruleset 2>/dev/null \
        || nft list ruleset 2>/dev/null \
        || echo "UNAVAILABLE")

    if [[ "${NFT_RULES}" == "UNAVAILABLE" ]]; then
        dash "Cannot read nftables (no sudo) -- run as root for full details"
    else
        RULE_COUNT=$(echo "${NFT_RULES}" | grep -c "^" || true)
        info "Ruleset size: ~${RULE_COUNT} lines"

        # Check for lockdown table
        if echo "${NFT_RULES}" | grep -q "varithon_lockdown"; then
            LOCKDOWN_POLICY=$(echo "${NFT_RULES}" | grep "policy" | head -1 | xargs || echo "?")
            cross "Lockdown table active -- ${LOCKDOWN_POLICY}"
            DARK=$((DARK+1))
            info "This is expected in BLACK-BOX state"
        elif echo "${NFT_RULES}" | grep -q "tailscale0"; then
            tick "tailscale0 accept rule present in ruleset"
            EXPOSED=$((EXPOSED+1))
        elif [[ "${NFT_RULES}" == "flush ruleset" ]] || [[ -z "$(echo "${NFT_RULES}" | tr -d '[:space:]')" ]]; then
            dash "Ruleset is EMPTY -- machine is fully unfiltered (no nft rules at all)"
        else
            dash "Non-standard ruleset (manual review recommended)"
            info "Summary (first 10 lines):"
            echo "${NFT_RULES}" | head -10 | while IFS= read -r line; do
                info "  ${line}"
            done
        fi
    fi
else
    dash "'nft' not found -- checking iptables"
    if command -v iptables >/dev/null 2>&1; then
        INPUT_POLICY=$(sudo iptables -L INPUT --line-numbers -n 2>/dev/null | head -1 | awk '{print $NF}' || echo "?")
        info "iptables INPUT policy: ${INPUT_POLICY}"
        if [[ "${INPUT_POLICY}" == "DROP" ]]; then
            cross "iptables INPUT=DROP (locked)"
            DARK=$((DARK+1))
        else
            tick "iptables INPUT=${INPUT_POLICY}"
            EXPOSED=$((EXPOSED+1))
        fi
    else
        dash "Neither nft nor iptables found"
    fi
fi
echo ""

# ---- Overall assessment -----------------------------------------------------
echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BOLD}OVERALL STATE${NC}"
echo ""

TOTAL=$((EXPOSED + DARK))

if [[ ${TOTAL} -eq 0 ]]; then
    echo -e "  ${YELLOW}${BOLD}[UNKNOWN]${NC}  Could not determine state (no checks completed)"
elif [[ ${EXPOSED} -gt 0 && ${DARK} -eq 0 ]]; then
    echo -e "  ${GREEN}${BOLD}[EXPOSED]${NC}   All components RUNNING -- Funnel is live"
    echo -e "  ${GREEN}            Public URL: ${FUNNEL_URL}${NC}"
elif [[ ${EXPOSED} -eq 0 && ${DARK} -gt 0 ]]; then
    echo -e "  ${RED}${BOLD}[BLACK BOX]${NC} All components STOPPED -- laptop is dark"
else
    echo -e "  ${YELLOW}${BOLD}[PARTIAL]${NC}   Mixed state (${EXPOSED} up / ${DARK} down)"
    echo -e "  ${YELLOW}            Run laptop-start.sh or laptop-stop.sh to reach a clean state${NC}"
fi

echo ""
echo -e "  ${DIM}Start : bash scripts/laptop-start.sh${NC}"
echo -e "  ${DIM}Stop  : bash scripts/laptop-stop.sh${NC}"
echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
