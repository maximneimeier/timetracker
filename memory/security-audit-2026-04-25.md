# Security Audit Report

**Datum:** 2026-04-25 08:00 CEST (Debian GNU/Linux 13 - trixie)

## OpenClaw Security Audit

**Ergebnis:** ✅ Keine kritischen Probleme gefunden

| Level | Anzahl |
|-------|--------|
| Critical | 0 |
| Warn | 1 |
| Info | 1 |

### Warnung
**gateway.trusted_proxies_missing**
- Reverse proxy headers sind nicht vertraut
- `gateway.bind` ist auf Loopback, aber `gateway.trustedProxies` ist leer
- Falls du die Control UI über einen Reverse Proxy erreichst, konfiguriere `trustedProxies`

### Info
**Attack Surface Summary**
- Open groups: 0
- Allowlist groups: 2
- Tools elevated: enabled
- Hooks webhooks: disabled
- Hooks internal: enabled
- Browser control: enabled
- Trust model: Personal assistant (one trusted operator boundary)

## OpenClaw Update Status

| Item | Status |
|------|--------|
| Install | pnpm |
| Channel | stable |
| Update | ⚠️ verfügbar (npm 2026.4.23) |

**Hinweis:** Config wurde von einer neueren OpenClaw-Version (2026.4.15) geschrieben; aktuelle Version ist 2026.4.12.

## Offene Ports

| Protokoll | Port | Status |
|-----------|------|--------|
| TCP | 127.0.0.1:18789 | Internal Gateway |
| TCP | 127.0.0.11:33699 | Container DNS |
| TCP | 0.0.0.0:54020 | Offener Port |

## Empfohlene Aktionen

1. **Update:** `openclaw update` ausführen (v2026.4.12 → v2026.4.23)
2. **Trusted Proxies:** Falls Reverse Proxy verwendet → `gateway.trustedProxies` konfigurieren
3. **Port 54020:** Prüfen, welcher Dienst auf 0.0.0.0:54020 lauscht

---
**Report erstellt von:** healthcheck:security-audit (Cron)
