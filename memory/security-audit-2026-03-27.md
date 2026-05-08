---
date: 2026-03-27
type: daily-security-audit
---

# Security Audit Report - 2026-03-27

## OpenClaw Security Audit Summary
- **Critical:** 0
- **Warnings:** 1
- **Info:** 1

## Findings

### ⚠️ WARN
**gateway.trusted_proxies_missing** - Reverse proxy headers are not trusted
- Details: `gateway.bind` is loopback and `gateway.trustedProxies` is empty. 
- Risk: If Control UI is exposed through a reverse proxy, local-client checks could be spoofed.
- Fix: Set `gateway.trustedProxies` to your proxy IPs or keep the Control UI local-only.

### ℹ️ INFO
**summary.attack_surface** - Attack surface summary
- Open groups: 0
- Allowlist groups: 1
- Elevated tools: enabled
- Webhooks: disabled
- Internal hooks: disabled
- Browser control: enabled
- Trust model: personal assistant (one trusted operator boundary)

## Update Status
- **Install:** pnpm
- **Channel:** stable
- **Status:** ⚠️ Update available (npm 2026.3.24)
- **Action:** Run `openclaw update` to update

## Recommended Actions
1. Consider updating OpenClaw to latest version
2. Review `gateway.trustedProxies` configuration if using a reverse proxy

## Host Info (Auto-detected)
- OS: Linux 6.8.0-101-generic (x64)
- Node: v22.22.1
- Runtime: host=24d99c87ae6c

---
*Audit performed by: healthcheck skill (Jarvis)*
*Next audit: Scheduled daily via cron (healthcheck:security-audit)*
