---
description: Start Chromium browser with remote debugging for browser automation
---

# Start Browser for Automation

This workflow starts Chromium with remote debugging enabled so browser automation can work.

## Steps

// turbo
1. Start Chromium with remote debugging:
```bash
chromium-browser --remote-debugging-port=9222 --no-first-run --no-default-browser-check &
```

2. Wait for browser to be ready:
```bash
sleep 3 && curl -s http://127.0.0.1:9222/json/version | head -1
```

Once you see output from step 2, the browser is ready for automation.
