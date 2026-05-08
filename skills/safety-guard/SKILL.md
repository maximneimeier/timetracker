# Safety Guard Skill

## Beschreibung
Erweiterte Sicherheitskontrollen für OpenClaw - als zusätzliche Schicht über die nativen Safety-Features.

## Verwendung

Dieser Skill wird automatisch geladen und überwacht:
- User-Inputs auf Jailbreak-Versuche
- Tool-Aufrufe auf Gefährlichkeit
- Outputs auf PII-Leaks

## Konfiguration

### In `config.yaml` (optional):

```yaml
skills:
  safety-guard:
    enabled: true
    strict_mode: false  # true = mehr Blockaden
    log_all_requests: true
```

### Umgebungsvariablen:

```bash
export OPENCLAW_SAFETY_STRICT=1  # Strict mode
export OPENCLAW_SAFETY_LOG=/path/to/custom/log.md
```

## Safety-Levels

### Level 1: Standard (Default)
- Jailbreak-Detection
- Illegale Aktivitäten blockieren
- PII-Redaction

### Level 2: Strict
- Zusätzlich: Alle File-Operationen bestätigen
- Web-Search limitiert
- Externe Messages immer bestätigen

### Level 3: Paranoid
- Alle Tool-Aufrufe bestätigen
- Kein automatisches Memory-Update
- Alle Outputs auf PII prüfen

## Manuelle Prüfung

Du kannst jederzeit prüfen:

```python
# In einer Python-Session
from safety_filter import check_input, check_output

# Input prüfen
is_safe, reason = check_input("User message here")

# Output säubern
safe_output = check_output("AI response here")
```

## Blockierte Patterns

Siehe `/.openclaw/safety_filter.py` für die vollständige Liste.

Kategorien:
1. **Jailbreak** - Prompt injection, ignore instructions
2. **Illegal** - Hacking, Malware, Betrug
3. **PII** - Kreditkarten, SSN, private Daten
4. **Sensitive** - Medizin, Recht, Finanzen

## Logging

Alle Safety-Events werden protokolliert in:
`/data/.openclaw/workspace/memory/safety-log.md`

Format:
```markdown
## 2026-03-18T21:30:00
**🚫 BLOCKED** - Jailbreak Attempt
Pattern matched: ignore.*previous.*instructions

---
```

## Integration mit OpenClaw

Dieser Skill erweitert OpenClaw's native Policies:
- Liest `POLICY.md` aus dem Workspace
- Respektiert Tool-Blocklists aus der Config
- Fügt zusätzliche Input/Output-Filter hinzu

## Troubleshooting

**Zu viele Blockaden?**
- `strict_mode: false` setzen
- Spezifische Patterns aus `safety_filter.py` entfernen

**Zu wenig Schutz?**
- `strict_mode: true` aktivieren
- Eigene Patterns in `BLOCKED_PATTERNS` hinzufügen

**Falsche Positive?**
- In `safety-log.md` dokumentieren
- Pattern anpassen oder entfernen

## Wartung

**Monatlich prüfen:**
1. `safety-log.md` auf wiederholte Versuche analysieren
2. Neue Jailbreak-Techniken recherchieren
3. Patterns aktualisieren
4. False Positives korrigieren

## Vergleich mit NeMo Guardrails

| Feature | NeMo Guardrails | Dieser Skill |
|---------|----------------|--------------|
| Komplexität | Hoch (Colang lernen) | Niedrig (Python) |
| Setup | 30-60 Min + GPU | Sofort einsatzbereit |
| Flexibilität | Sehr hoch | Mittel |
| Enterprise-Features | Ja (Audit, Compliance) | Basic Logging |
| Unterhaltung | Aufwändig | Einfach |

**Fazit:** Für individuelle Nutzung und kleine Teams ist dieser Skill ausreichend. Für Enterprise mit Compliance-Anforderungen: NeMo in Betracht ziehen.

---

**Version:** 1.0
**Autor:** Jarvis (AI Assistant)
**Letzte Aktualisierung:** 2026-03-18
