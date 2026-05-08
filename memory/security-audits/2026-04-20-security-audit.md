# Security Audit Report - 2026-04-20

**Datum:** 20. April 2026, 08:00 UTC
**Durchgeführt von:** Jarvis (Cron: healthcheck:security-audit)
**Hostname:** 13b4a6cdcf2d

## Zusammenfassung

| Kategorie | Anzahl |
|-----------|--------|
| Kritisch | 0 |
| Warnung | 1 |
| Info | 1 |

## Ergebnisse

### ⚠️ WARNUNG: Trusted Proxies Missing

**Befund:** Reverse-Proxy-Header sind nicht vertrauenswürdig konfiguriert

**Details:**
- `gateway.bind` ist auf Loopback gesetzt
- `gateway.trustedProxies` ist leer
- Wenn die Control UI über einen Reverse-Proxy erreichbar gemacht wird, können lokale Client-Checks manipuliert werden

**Empfohlene Lösung:**
```bash
# Option A: Wenn ein Reverse-Proxy verwendet wird
openclaw config set gateway.trustedProxies "<PROXY-IP>"

# Option B: Control UI bleibt lokal-only (empfohlen, wenn kein Reverse-Proxy nötig)
# Keine Änderung nötig, Konfiguration ist bereits sicher für lokalen Zugriff
```

### ℹ️ INFO: Angriffsfläche

| Komponente | Status |
|------------|--------|
| Offene Gruppen | 0 |
| Allowlist-Gruppen | 2 |
| Elevated Tools | enabled |
| Webhooks | disabled |
| Interne Hooks | enabled |
| Browser Control | enabled |

**Trust Model:** Personal Assistant (ein vertrauenswürdiger Operator), NICHT Multi-Tenant-fähig

## OpenClaw Status

| Item | Wert |
|------|------|
| Installationsmethode | pnpm |
| Kanal | stable |
| Aktuelle Version | 2026.4.12 |
| Verfügbares Update | 2026.4.15 |

**Empfohlene Aktion:** Update verfügbar. Ausführen mit:
```bash
openclaw update
```

## Empfohlene nächste Schritte

1. **Optional:** Review der `gateway.trustedProxies` Konfiguration, falls Reverse-Proxy im Einsatz
2. **Empfohlen:** OpenClaw auf Version 2026.4.15 aktualisieren
3. **Regelmäßig:** Diesen Security-Audit weiterhin täglich durchführen

---
*Dieser Bericht wurde automatisch generiert. Bei Problemen 'healthcheck' aufrufen für Unterstützung bei der Behebung.*
