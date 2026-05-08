# Security Audit Report - 2026-04-03
**Run by:** Jarvis (automated cron job)  
**Time:** Friday, April 3rd, 2026 — 8:00 AM (Europe/Berlin)

## OpenClaw Security Audit Results

```
Summary: 0 critical · 1 warn · 1 info
```

### ⚠️ WARNING (1)

**gateway.trusted_proxies_missing** — Reverse proxy headers are not trusted

- `gateway.bind` is loopback and `gateway.trustedProxies` is empty
- If you expose the Control UI through a reverse proxy, configure trusted proxies so local-client checks cannot be spoofed
- **Fix:** Set `gateway.trustedProxies` to your proxy IPs or keep the Control UI local-only

### ℹ️ INFO (1)

**summary.attack_surface** — Attack surface summary

| Setting | Status |
|---------|--------|
| groups | open=0, allowlist=1 |
| tools.elevated | enabled |
| hooks.webhooks | disabled |
| hooks.internal | disabled |
| browser control | enabled |
| trust model | personal assistant (one trusted operator) |

## OpenClaw Update Status

| Item | Value |
|------|-------|
| Install | pnpm |
| Channel | stable (config) |
| Update | **available** · npm update 2026.4.2 |

**Action:** Update available. Run: `openclaw update`

## System Information

- **OS:** Debian GNU/Linux 13 (trixie)
- **Kernel:** Linux 6.8.0-101-generic
- **Architecture:** x86_64
- **Firewall:** No standard firewall (ufw/firewalld) detected

## Issues Requiring Attention

1. **trusted_proxies_missing** — Non-critical but recommended to configure if using reverse proxy
2. **update_available** — OpenClaw update available (2026.4.2)

## Recommendations

- Consider running `openclaw security audit --fix` to apply OpenClaw safe defaults
- Review `gateway.trustedProxies` configuration if exposing Control UI behind reverse proxy
- Schedule `openclaw update` to get latest security patches

---
*Next scheduled audit: Daily*
*To fix issues: Run `healthcheck` skill or `openclaw security audit --fix`*
