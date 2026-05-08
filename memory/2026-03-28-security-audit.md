# Security Audit - 2026-03-28

**Status:** Daily automated audit (cron job: healthcheck:security-audit)
**Time:** 2026-03-28 07:00 UTC

## OpenClaw Security Audit Results

**Summary:** 0 critical · 1 warn · 1 info

### Warnings
- **gateway.trusted_proxies_missing** - Reverse proxy headers are not trusted
  - Reason: gateway.bind is loopback and gateway.trustedProxies is empty
  - Impact: If Control UI exposed through reverse proxy, local-client checks could be spoofed
  - Fix: Set gateway.trustedProxies to proxy IPs or keep Control UI local-only

### Information
- **Attack surface summary:**
  - Open groups: 0
  - Allowlist groups: 1
  - Tools elevated: enabled
  - Hooks webhooks: disabled
  - Hooks internal: disabled
  - Browser control: enabled
  - Trust model: personal assistant (one trusted operator)

## System Info
- **OS:** Debian GNU/Linux 13 (trixie)
- **Kernel:** Linux 6.8.0-101-generic
- **Host:** 24d99c87ae6c (containerized)

## Update Status
- **Channel:** stable
- **Status:** Update available (npm 2026.3.24, released 2026.03.24)
- **Action needed:** Run `openclaw update` to update

## Configuration Issues
- Config error detected: ANTHROPIC_MODEL_ALIASES initialization issue
- This appears to be a non-critical internal error but may affect model resolution

## Next Steps
- No critical issues requiring immediate action
- Consider configuring trustedProxies if using reverse proxy
- Schedule update at convenient time
