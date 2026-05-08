# Security Audit Report - 2026-04-01
**Automated daily security check via cron job `healthcheck:security-audit`**

---

## 📊 System Information
- **OS:** Debian GNU/Linux 13 (trixie)
- **Kernel:** Linux 6.8.0-101-generic
- **Architecture:** x86_64
- **Host:** Container/Ubuntu-VM (24d99c87ae6c)

---

## 🔒 OpenClaw Security Audit

### Summary
| Level | Count |
|-------|-------|
| Critical | 0 |
| Warning | 1 |
| Info | 1 |

### Findings

#### ⚠️ WARN: `gateway.trusted_proxies_missing`
**Issue:** Reverse proxy headers are not trusted
- `gateway.bind` is loopback and `gateway.trustedProxies` is empty
- **Risk:** If Control UI is exposed through reverse proxy, local-client checks could be spoofed
- **Fix:** Set `gateway.trustedProxies` to proxy IPs or keep Control UI local-only

#### ℹ️ INFO: `summary.attack_surface`
**Attack Surface:**
- Open groups: 0
- Allowlist groups: 1
- Tools elevated: enabled
- Webhooks: disabled
- Internal hooks: disabled
- Browser control: enabled
- Trust model: personal assistant (single operator)

---

## 🔄 OpenClaw Update Status
| Item | Status |
|------|--------|
| Install | pnpm |
| Channel | stable |
| **Update** | **available** · npm 2026.3.31 |

---

## 🔥 Firewall/Network
- **Listening ports:** Keine aktiven Listener gefunden (oder Befehl nicht verfügbar)
- **Firewall tool:** Nicht erkannt (ufw/firewall-cmd)

---

## 📝 Empfohlene Aktionen

1. **Update verfügbar:** `openclaw update` ausführen
2. **Reverse Proxy:** Falls du einen Reverse Proxy nutzt, konfiguriere `trustedProxies` in openclaw.json
3. **Firewall:** Prüfe ob eine Firewall aktiv sein sollte

---

**Keine kritischen Sicherheitsprobleme gefunden.**

_Reminder: Bei Problemen `healthcheck` Skill verwenden zum Beheben._
