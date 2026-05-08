# Security Audit Report - 2026-04-04

**Date:** Saturday, April 4, 2026  
**Time:** 08:00 AM (Europe/Berlin)  
**Host:** Linux 24d99c87ae6c (Debian GNU/Linux 13 trixie)  
**Audit Type:** Daily automated security check

---

## OpenClaw Security Audit Results

**Summary:** 0 critical · 1 warn · 1 info

### ⚠️ Warning (1)

| Issue | Details |
|-------|---------|
| `gateway.trusted_proxies_missing` | Reverse proxy headers are not trusted. Gateway.bind is loopback and gateway.trustedProxies is empty. If you expose the Control UI through a reverse proxy, configure trusted proxies so local-client checks cannot be spoofed. |
| **Fix** | Set `gateway.trustedProxies` to your proxy IPs or keep the Control UI local-only. |

### ℹ️ Info (1)

| Issue | Details |
|-------|---------|
| `summary.attack_surface` | Attack surface summary: groups open=0, allowlist=1. Tools.elevated: enabled. Hooks.webhooks: disabled. Hooks.internal: disabled. Browser control: enabled. Trust model: personal assistant (one trusted operator boundary). |

---

## Update Status

| Item | Value |
|------|-------|
| Install | pnpm |
| Channel | stable (config) |
| **Update** | **available** · pnpm · npm update 2026.4.2 |

**Action:** Run `openclaw update` to update to the latest version.

---

## Recommendations

1. **Configure trusted proxies** if using a reverse proxy for the Control UI
2. **Update OpenClaw** to version 2026.4.2 (npm channel)
3. Consider running `openclaw security audit --fix` to apply OpenClaw safe defaults

---

*Automated daily security audit via cron job `healthcheck:security-audit`*
