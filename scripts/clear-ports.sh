#!/bin/bash

PORTS="3000,3001,3002"
KILLED=$(lsof -ti:$PORTS 2>/dev/null | xargs -r kill 2>/dev/null && echo "yes" || echo "none")

if [ "$KILLED" = "none" ]; then
  echo "✓ Ports 3000-3002 already clear"
else
  echo "✓ Killed processes on ports 3000-3002"
fi
