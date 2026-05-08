# Security Audit Report - 2026-05-01

**Ausgeführt:** 2026-05-01 08:00 CET (täglicher Cron)
**Befehl:** `openclaw security audit --deep`

## Ergebnis: ✅ KEINE KRITISCHEN PROBLEME

| Kategorie | Anzahl |
|-----------|--------|
| Kritisch  | 0 |
| Warnungen | 1 |
| Info      | 1 |

## Warnung

### gateway.trusted_proxies_missing
**Beschreibung:** Reverse proxy headers are not trusted
**Details:** `gateway.bind` ist loopback und `gateway.trustedProxies` ist leer. Falls das Control UI durch einen Reverse Proxy freigegeben wird, sollten vertrauenswürdige Proxies konfiguriert werden, damit local-client checks nicht gespooft werden können.

**Fix:** `gateway.trustedProxies` auf die Proxy-IPs setzen oder Control UI local-only belassen.

## Informationen

### Attack Surface Summary
- Offene Ports: 0
- Allowlist-Einträge: 2
- Elevated Tools: enabled
- Webhooks: disabled
- Internal Hooks: enabled
- Browser Control: enabled
- Trust Model: Personal Assistant (one trusted operator boundary)

## Update Status

**Status:** Update verfügbar
- Aktuell: 2026.4.12
- Verfügbar: 2026.4.29 (npm)
- **Aktion empfohlen:** `openclaw update`

**Hinweis:** Config wurde von neuerer OpenClaw-Version (2026.4.15) geschrieben.

## Empfohlene Aktionen

1. [Optional] `openclaw update` für das verfügbare Update
2. [Optional] Falls Reverse Proxy verwendet wird: `gateway.trustedProxies` konfigurieren

---
*Für Problemebehebung: `healthcheck` Skill verwenden*
