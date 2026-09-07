#!/usr/bin/env bash
# =============================================================================
# laptop-start.sh — Varithon 2026 — EXPOSED state
# =============================================================================
# What this script does (in order):
#   1. Starts tailscaled systemd service (if not already running)
#   2. Brings Tailscale up (auth check — will prompt if not logged in)
#   3. Opens the nftables firewall to allow traffic on tailscale0 interface
#   4. Starts the FastAPI / uvicorn backend on 0.0.0.0:8000 (background)
#   5. Enables Tailscale Funnel so https://terminalhack.tail92f130.ts.net
#      publicly proxies to http://127.0.0.1:8000
#
# Usage:
#   cd ~/Coding/Varithon_2026
#   bash scripts/laptop-start.sh
#
# Requires:
#   - sudo (for tailscaled start + nftables)
#   - tailscale authenticated (run `tailscale login` once if not)
#   - Funnel enabled for your account (tailscale.com/admin -> DNS -> Funnel)
# =============================================================================

set -euo pipefail

# ---- Config -----------------------------------------------------------------
REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_DIR="${REPO_DIR}/varithon-backend"
VENV_UVICORN="${BACKEND_DIR}/.venv/bin/uvicorn"
PID_FILE="/tmp/varithon-uvicorn.pid"
LOG_FILE="/tmp/varithon-uvicorn.log"
BACKEND_PORT=8000
FUNNEL_URL="https://terminalhack.tail92f130.ts.net"

# ---- Colors -----------------------------------------------------------------
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
CYAN='\033[0;36m'; BOLD='\033[1m'; NC='\033[0m'

info()    { echo -e "${CYAN}[INFO]${NC}  $*"; }
ok()      { echo -e "${GREEN}[OK]${NC}    $*"; }
warn()    { echo -e "${YELLOW}[WARN]${NC}  $*"; }
fail()    { echo -e "${RED}[FAIL]${NC}  $*" >&2; exit 1; }
section() { echo -e "\n${BOLD}▶ $*${NC}"; }

# ---- Preflight checks -------------------------------------------------------
section "Preflight checks"

[[ -d "${BACKEND_DIR}" ]] || fail "Backend dir not found: ${BACKEND_DIR}"
[[ -x "${VENV_UVICORN}" ]] || fail "uvicorn not found in venv: ${VENV_UVICORN}
  Run inside varithon-backend/: uv venv && uv pip install -r requirements.txt"

command -v tailscale  >/dev/null || fail "'tailscale' not found -- install it first."
command -v tailscaled >/dev/null || fail "'tailscaled' not found -- install it first."
command -v nft        >/dev/null || warn "'nft' not found -- firewall step will be skipped."
ok "All binaries present"

# ---- Step 1 : Start tailscaled ----------------------------------------------
section "Step 1 -- Starting tailscaled service"

if systemctl is-active --quiet tailscaled; then
    ok "tailscaled already running"
else
    sudo systemctl start tailscaled
    sleep 1
    systemctl is-active --quiet tailscaled || fail "tailscaled failed to start"
    ok "tailscaled started"
fi

# Also ensure it re-enables on boot (idempotent)
sudo systemctl enable tailscaled --quiet 2>/dev/null || true

# ---- Step 2 : Bring Tailscale up --------------------------------------------
section "Step 2 -- Bringing Tailscale up"

TS_STATUS=$(tailscale status --json 2>/dev/null | python3 -c \
    "import sys,json; d=json.load(sys.stdin); print(d.get('BackendState','Unknown'))" 2>/dev/null || echo "Unknown")

if [[ "${TS_STATUS}" == "Running" ]]; then
    ok "Tailscale already up (BackendState=Running)"
else
    info "BackendState=${TS_STATUS} -- running 'tailscale up'..."
    # --accept-routes: pull routes from other Tailscale nodes (e.g. the desktop)
    # --ssh: keep SSH over Tailscale available while exposed
    tailscale up --accept-routes --ssh || fail "'tailscale up' failed -- run 'tailscale login' if not authenticated"
    sleep 2
    ok "Tailscale is up"
fi

TS_NAME=$(tailscale status --json 2>/dev/null | python3 -c \
    "import sys,json; d=json.load(sys.stdin); print(d.get('Self',{}).get('DNSName','?'))" 2>/dev/null || echo "?")
info "This node's Tailscale DNS: ${TS_NAME}"

# ---- Step 3 : Firewall -- allow tailscale0 ----------------------------------
section "Step 3 -- Opening firewall for tailscale0"

if command -v nft >/dev/null; then
    # Check if the allow rule already exists
    if sudo nft list ruleset 2>/dev/null | grep -q "tailscale0"; then
        ok "tailscale0 rule already present in nftables"
    else
        # Add an input accept rule for all traffic on tailscale0 interface.
        # Scoped only to the Tailscale virtual interface -- NOT the physical NIC.
        sudo nft add rule inet filter input iifname "tailscale0" accept \
            comment '"varithon: allow tailscale0 inbound"' 2>/dev/null || \
        sudo nft add rule ip filter INPUT iifname "tailscale0" accept 2>/dev/null || \
            warn "Could not add nftables rule (may need manual setup). Continuing."
        ok "nftables: tailscale0 accept rule added"
    fi
else
    warn "nft not available -- skipping firewall step"
fi

# ---- Step 4 : Start uvicorn backend -----------------------------------------
section "Step 4 -- Starting FastAPI backend (uvicorn)"

# Kill any stale uvicorn from a previous run
if [[ -f "${PID_FILE}" ]]; then
    OLD_PID=$(cat "${PID_FILE}")
    if kill -0 "${OLD_PID}" 2>/dev/null; then
        warn "Stale uvicorn PID ${OLD_PID} found -- killing it first"
        kill "${OLD_PID}" 2>/dev/null || true
        sleep 1
    fi
    rm -f "${PID_FILE}"
fi

# Also sweep for any orphan uvicorn on port 8000 (e.g. launched manually)
EXISTING_PID=$(lsof -ti tcp:"${BACKEND_PORT}" 2>/dev/null | head -1 || true)
if [[ -n "${EXISTING_PID}" ]]; then
    warn "Port ${BACKEND_PORT} already in use by PID ${EXISTING_PID} -- killing it"
    kill "${EXISTING_PID}" 2>/dev/null || true
    sleep 1
fi

# Launch uvicorn from inside the backend dir (main.py must be importable)
cd "${BACKEND_DIR}"
nohup "${VENV_UVICORN}" main:app \
    --host 0.0.0.0 \
    --port "${BACKEND_PORT}" \
    --log-level info \
    > "${LOG_FILE}" 2>&1 &
UVICORN_PID=$!
echo "${UVICORN_PID}" > "${PID_FILE}"

# Cleanup trap: if anything below fails, kill the uvicorn we just spawned
# and remove the PID file so the next run starts clean (no orphan / stale PID).
_cleanup_on_fail() {
    local exit_code=$?
    if [[ ${exit_code} -ne 0 ]]; then
        warn "Startup failed — cleaning up uvicorn PID ${UVICORN_PID}..."
        kill "${UVICORN_PID}" 2>/dev/null || true
        sleep 0.5
        kill -KILL "${UVICORN_PID}" 2>/dev/null || true
        rm -f "${PID_FILE}"
        warn "PID file removed. Run laptop-stop.sh to ensure full cleanup."
    fi
}
trap '_cleanup_on_fail' EXIT

info "uvicorn started -- PID ${UVICORN_PID} | log: ${LOG_FILE}"

# Wait up to 8 s for the health endpoint to respond
info "Waiting for /health to respond..."
for i in $(seq 1 16); do
    sleep 0.5
    if curl -sf "http://127.0.0.1:${BACKEND_PORT}/health" >/dev/null 2>&1; then
        ok "Backend is healthy at http://127.0.0.1:${BACKEND_PORT}"
        break
    fi
    if [[ $i -eq 16 ]]; then
        fail "Backend did not become healthy after 8 s. Check log: ${LOG_FILE}"
    fi
done

# ---- Step 5 : Enable Tailscale Funnel ---------------------------------------
section "Step 5 -- Enabling Tailscale Funnel"

# tailscale funnel <port> enables HTTPS Funnel for the given local port.
# --bg keeps the funnel alive after the shell exits.
#
# Tailscale v1.84+ requires operator permissions for funnel.
# One-time fix (run once, then this script never needs sudo for funnel):
#   sudo tailscale set --operator=$USER

_enable_funnel() {
    # Try as current user first (works if operator is set)
    if tailscale funnel --bg "${BACKEND_PORT}" 2>/tmp/ts-funnel-err; then
        ok "Funnel enabled (--bg)"
        return 0
    fi

    # Check if the error is the operator/permission error
    if grep -qi "access denied\|denied\|operator" /tmp/ts-funnel-err 2>/dev/null; then
        warn "Funnel needs elevated permissions (Tailscale operator not set for $USER)"
        info "Tip: run once to fix permanently: sudo tailscale set --operator=$USER"
        info "Trying with sudo..."
        if sudo tailscale funnel --bg "${BACKEND_PORT}" 2>/dev/null; then
            ok "Funnel enabled (sudo --bg)"
            return 0
        fi
    fi

    # Last resort: legacy serve --funnel syntax
    info "Trying legacy 'tailscale serve --funnel' syntax..."
    if sudo tailscale serve --funnel --bg "http://127.0.0.1:${BACKEND_PORT}" 2>/dev/null; then
        ok "Funnel enabled (legacy serve --funnel)"
        return 0
    fi

    # All attempts failed — surface the original error
    cat /tmp/ts-funnel-err >&2 2>/dev/null || true
    fail "Could not enable Funnel. Check: tailscale funnel status
  Make sure Funnel is enabled for your account: https://tailscale.com/kb/1223/funnel
  Or run once: sudo tailscale set --operator=\$USER"
}

_enable_funnel

# Confirm funnel is live
sleep 1
FUNNEL_CHECK=$(tailscale funnel status 2>/dev/null || tailscale serve status 2>/dev/null)
FUNNEL_CONFIRMED=0
if echo "${FUNNEL_CHECK}" | grep -q "Funnel on"; then
    ok "Funnel confirmed active"
    FUNNEL_CONFIRMED=1
else
    warn "Funnel status unconfirmed -- propagation can take a few seconds."
    warn "Verify with: tailscale funnel status"
fi

# ---- Done -------------------------------------------------------------------
trap - EXIT   # success — disable the orphan-cleanup trap

echo ""
echo -e "${GREEN}${BOLD}=====================================================${NC}"
echo -e "${GREEN}${BOLD}  VARITHON LAPTOP -- EXPOSED and ready               ${NC}"
echo -e "${GREEN}${BOLD}=====================================================${NC}"
echo ""
echo -e "  Public URL  : ${CYAN}${FUNNEL_URL}${NC}"
echo -e "  Local API   : ${CYAN}http://127.0.0.1:${BACKEND_PORT}${NC}"
echo -e "  uvicorn PID : ${UVICORN_PID}"
echo -e "  Backend log : ${LOG_FILE}"
if [[ ${FUNNEL_CONFIRMED} -eq 0 ]]; then
    echo -e "  Funnel      : ${YELLOW}⚠ Unconfirmed — verify: tailscale funnel status${NC}"
fi
echo ""
echo -e "  Follow logs : tail -f ${LOG_FILE}"
echo -e "  Stop all    : bash ${REPO_DIR}/scripts/laptop-stop.sh"
echo ""
