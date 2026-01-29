# Testing Guide

This project uses Playwright for end-to-end testing.

## Coder Workspace Setup

**IMPORTANT:** This project runs in a Coder workspace (containerized Linux environment). Special configuration is required for Playwright UI mode.

### Required System Dependencies

The following libraries are required for Playwright browsers to run:
```bash
sudo apt-get install -y libnss3 libnspr4 libatk1.0-0 libatk-bridge2.0-0 \
  libcups2 libdrm2 libdbus-1-3 libxkbcommon0 libxcomposite1 libxdamage1 \
  libxfixes3 libxrandr2 libgbm1 libasound2t64 libpango-1.0-0 libcairo2 \
  libatspi2.0-0 libxkbcommon0 xorg xvfb
```

### Key Configuration: `--ui-host=0.0.0.0`

**For Docker/containerized environments like Coder, you MUST use `--ui-host=0.0.0.0`** to bind Playwright UI to all network interfaces. This allows port forwarding to work correctly.

```bash
xvfb-run -a pnpm exec playwright test --ui --ui-host=0.0.0.0
```

### Why `xvfb-run` is Needed

The Coder workspace doesn't have a physical display (X Server). Playwright UI mode spawns a Chromium browser to render the UI itself, which requires a display server. `xvfb-run` provides a virtual X Server (X Virtual Frame Buffer).

### Accessing Playwright UI via Coder Port Forwarding

1. Run: `pnpm test:ui`
2. Note the port shown (e.g., `Listening on http://0.0.0.0:35427`)
3. In Coder, add port forwarding for that port
4. Access via: `https://[port]--main--database-query-tool-ws-1--jameshoran.coder.hahomelabs.com/`

## Test Commands

| Command | Description |
|---------|-------------|
| `pnpm test` | Run all tests (headless, fast) |
| `pnpm test:headed` | Run tests with visible browser |
| `pnpm test:ui` | Launch interactive Playwright UI |
| `pnpm test:report` | View HTML test report |

## Running Tests

### Quick Run (Headless)
```bash
pnpm test
```

### Run Specific Test File
```bash
pnpm test auth-login
```

### Playwright UI (Interactive Test Runner)

**IMPORTANT:** In Coder workspace/containerized environments, use:

```bash
# Start UI with proper host binding for port forwarding
xvfb-run -a pnpm exec playwright test --ui --ui-host=0.0.0.0
```

Then access via Coder port forwarding. The UI will show the port it's listening on (e.g., `Listening on http://0.0.0.0:35427`).

**Regular (local) environments:**
```bash
pnpm test:ui
```

## Test Structure

```
e2e/
├── home.spec.ts         # Home page tests (6 tests)
├── course.spec.ts       # Course page tests (6 tests)
├── progress.spec.ts     # Progress page tests (5 tests)
├── navigation.spec.ts   # Navigation tests (4 tests)
├── auth-login.spec.ts   # Login page tests (6 tests)
└── auth-signup.spec.ts  # Signup page tests (5 tests)
```

## Current Test Coverage

| Suite | Tests | Status |
|-------|-------|--------|
| Home Page | 6 | ✅ |
| Course Page | 6 | ✅ |
| Progress Page | 5 | ✅ |
| Navigation | 4 | ✅ |
| Login Page | 6 | ✅ |
| Signup Page | 5 | ✅ |
| **Total** | **32** | ✅ All passing |
