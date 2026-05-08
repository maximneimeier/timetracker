# Security Audit Report - 2026-03-15

**Zeit:** Sunday, March 15th, 2026 — 8:00 AM (Europe/Berlin)  
**System:** Debian GNU/Linux 13 (trixie) auf Linux 6.8.0-101-generic  
**Audit-Befehl:** `openclaw security audit --deep`

---

## Zusammenfassung

| Level | Anzahl |
|-------|--------|
| 🔴 Critical | 2 |
| 🟡 Warn | 1 |
| 🔵 Info | 1 |

---

## 🔴 Kritische Probleme (sofortige Behebung empfohlen)

### 1. Config-Datei ist world-readable
**Datei:** `/data/.openclaw/openclaw.json`  
**Berechtigung:** 644 (world-readable)  
**Risiko:** Config kann Tokens und private Einstellungen enthalten

**Fix:**
```bash
chmod 600 /data/.openclaw/openclaw.json
```

### 2. Skill mit gefährlichen Code-Patterns
**Skill:** `aisa-tavily` (openclaw-aisa-web-search-tavily)  
**Problem:** Environment-Harvesting - Zugriff auf Umgebungsvariablen kombiniert mit Netzwerk-Send  
**Dateien:**
- `scripts/extract.mjs:18`
- `scripts/search.mjs:42`

**Fix:** Skill-Quellcode überprüfen. Bei Nicht-Vertrauen:
```bash
rm -rf /data/.openclaw/workspace/skills/openclaw-aisa-web-search-tavily
```

---

## 🟡 Warnungen

### Trusted Proxies nicht konfiguriert
**Problem:** `gateway.bind` ist loopback und `gateway.trustedProxies` ist leer.  
**Risiko:** Wenn Control UI über Reverse Proxy exponiert wird, können local-client Checks gespooft werden.  
**Empfehlung:** `gateway.trustedProxies` auf Proxy-IPs setzen oder Control UI local-only halten.

---

## 🔵 Informationen

### Attack Surface Summary
- Groups: open=0, allowlist=1
- Elevated tools: enabled
- Webhooks: disabled
- Browser control: enabled
- Trust model: Personal assistant (one trusted operator boundary)

---

## Update-Status

| Item | Status |
|------|--------|
| Install | pnpm |
| Channel | stable |
| Update | **Verfügbar** - npm 2026.3.13 |

**Befehl zum Updaten:** `openclaw update`

---

## Empfohlene Aktionen

1. **Sofort:** Config-Berechtigungen fixen
2. **Sofort:** Skill überprüfen oder entfernen
3. **Optional:** OpenClaw updaten (`openclaw update`)
4. **Optional:** Trusted Proxies konfigurieren falls Reverse Proxy genutzt wird

---

*Automatisch erstellt durch healthcheck:security-audit cron job*
