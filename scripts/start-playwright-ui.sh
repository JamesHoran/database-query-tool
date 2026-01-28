#!/bin/bash
# Start Playwright Test UI with port forwarding
# This script launches Playwright UI in a headless environment and forwards it to port 9326

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

PORT=9326

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Starting Playwright Test UI${NC}"
echo -e "${BLUE}========================================${NC}"

# Kill any existing Playwright UI processes
echo -e "${YELLOW}Cleaning up old processes...${NC}"
pkill -f "playwright test --ui" 2>/dev/null || true
pkill -f "socat.*${PORT}" 2>/dev/null || true
sleep 2

# Start virtual display if not already running
if ! xhost >&/dev/null; then
  echo -e "${YELLOW}Starting virtual display (DISPLAY=:99)...${NC}"
  DISPLAY=:99 Xvfb :99 -screen 0 1920x1080x24 -ac > /dev/null 2>&1 &
  sleep 2
fi

# Start Playwright UI
echo -e "${YELLOW}Starting Playwright UI...${NC}"
DISPLAY=:99 pnpm exec playwright test --ui > /tmp/playwright-ui.log 2>&1 &
PW_PID=$!

# Wait for Playwright UI to start
echo -e "${YELLOW}Waiting for Playwright UI to start...${NC}"
sleep 6

# Find the Playwright UI port
PW_PORT=$(ss -tlnp 2>/dev/null | grep MainThread | head -1 | awk '{print $4}' | cut -d: -f2)

if [ -z "$PW_PORT" ]; then
  echo -e "\033[0;31mError: Playwright UI failed to start${NC}"
  echo "Check logs at: /tmp/playwright-ui.log"
  cat /tmp/playwright-ui.log
  exit 1
fi

echo -e "${GREEN}Playwright UI started on internal port: $PW_PORT${NC}"

# Start socat to forward to port 9326 (accessible from outside)
echo -e "${YELLOW}Setting up port forwarding to ${PORT}...${NC}"
socat tcp-listen:${PORT},reuseaddr,fork tcp:127.0.0.1:$PW_PORT > /dev/null 2>&1 &
SOCAT_PID=$!

sleep 2

echo -e "${GREEN}✓ Port forwarding active${NC}"
echo ""

# Auto-detect workspace URL from Coder environment variables
WORKSPACE_URL=""
if [ -n "$CODER_WORKSPACE_NAME" ] && [ -n "$CODER_WORKSPACE_OWNER_NAME" ]; then
  # Build from individual Coder env vars
  BRANCH="${CODER_WORKSPACE_AGENT_NAME:-main}"
  WORKSPACE="${CODER_WORKSPACE_NAME}"
  OWNER="${CODER_WORKSPACE_OWNER_NAME}"
  # Always use coder.hahomelabs.com as the domain
  WORKSPACE_URL="https://${PORT}--${BRANCH}--${WORKSPACE}--${OWNER}.coder.hahomelabs.com"
fi

# Display the access URL
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Playwright UI is READY!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}Access the UI at:${NC}"
if [ -n "$WORKSPACE_URL" ]; then
  echo -e "${MAGENTA}${WORKSPACE_URL}${NC}"
  echo ""
  echo -e "${CYAN}(Copy and paste the URL above into your browser)${NC}"
else
  echo -e "${CYAN}  https://${PORT}--<branch>--<workspace>--<username>.coder.hahomelabs.com${NC}"
fi
echo ""
echo -e "${BLUE}Press Ctrl+C to stop the UI${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Keep the script running and show process info
trap "echo -e '${YELLOW}Stopping Playwright UI...${NC}'; kill $PW_PID 2>/dev/null; kill $SOCAT_PID 2>/dev/null; exit 0" INT TERM

# Show status every few seconds
while true; do
  sleep 5
  if ! ps -p $PW_PID > /dev/null 2>&1; then
    echo -e "\033[0;31mPlaywright UI process died${NC}"
    exit 1
  fi
  if ! ps -p $SOCAT_PID > /dev/null 2>&1; then
    echo -e "\033[0;31mSocat process died${NC}"
    exit 1
  fi
done
