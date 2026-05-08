# Linear Issue: DSGVO-Compliant Registration Page

**Title:** Add DSGVO compliance checkboxes and verify legal pages exist

**Priority:** High (blocks beta launch)

**Assignee:** Dev Team

---

## Description

The current registration page for Planer/Calculus is NOT DSGVO compliant. Users can register without agreeing to AGB or acknowledging the privacy policy. We need to add required checkboxes and verify that all legal pages exist and are accessible.

---

## What Needs to Be Done

### 1. Add Checkboxes to Registration Form

Location: Below "Passwort wiederholen" field, above "Account erstellen" button

Required HTML:
```html
<div class="checkbox-group">
  <label>
    <input type="checkbox" name="agb_accepted" required>
    Ich habe die <a href="/agb" target="_blank">AGB</a> gelesen und stimme zu. *
  </label>
  
  <label>
    <input type="checkbox" name="privacy_accepted" required>
    Ich habe die <a href="/datenschutz" target="_blank">Datenschutzerklärung</a> zur Kenntnis genommen. *
  </label>
  
  <label>
    <input type="checkbox" name="marketing_consent">
    Ich möchte Produkt-Updates per E-Mail erhalten. (optional)
  </label>
</div>
```

**Rules:**
- First two checkboxes are REQUIRED (form validation)
- Third checkbox is OPTIONAL and must NOT be pre-selected
- "Account erstellen" button is DISABLED until both required checkboxes are checked
- Links open in new tab
- Style matches existing design (white/blue/gray theme)

### 2. Verify Legal Pages Exist

Check that these pages exist and are accessible:

| Page | URL | Status | Action |
|------|-----|--------|--------|
| AGB | `/agb` | ❓ Unknown | Verify content exists |
| Datenschutz | `/datenschutz` | ❓ Unknown | Verify content exists |
| Impressum | `/impressum` | ❓ Unknown | Verify content exists |

**If any page is missing or empty:** Create it with the content below.

### 3. Add Footer Links

Add to footer of main page:
- AGB
- Datenschutz  
- Impressum

---

## Content for Legal Pages (if missing)

### AGB (/agb)

```
Allgemeine Geschäftsbedingungen Atheniks UG (haftungsbeschränkt)

1. Geltungsbereich
Diese AGB gelten für die Nutzung von Planer und Calculus (nachfolgend "Services").

2. Vertragsschluss
Mit der Registrierung schließt der Nutzer einen Nutzungsvertrag mit Atheniks UG ab.

3. Nutzungsrechte
Atheniks gewährt dem Nutzer ein nicht-exklusives, nicht-übertragbares Recht zur Nutzung der Services.

4. Kosten
Die Nutzung ist während der Beta-Phase kostenlos. Spätere Preisänderungen werden mit 30 Tagen Vorankündigung kommuniziert.

5. Datenschutz
Die Datenschutzerklärung unter /datenschutz gilt ergänzend.

6. Haftung
Atheniks haftet nicht für Finanzentscheidungen, die auf Basis der Services getroffen werden.

7. Kündigung
Der Nutzer kann den Account jederzeit löschen. Atheniks kann den Vertrag bei Verstoß gegen diese AGB kündigen.

8. Gerichtsstand
München, Deutschland. Anwendbares Recht: Deutschland.

Stand: Mai 2026
```

### Datenschutzerklärung (/datenschutz)

```
Datenschutzerklärung Atheniks UG (haftungsbeschränkt)

1. Verantwortlicher
Atheniks UG (haftungsbeschränkt)
Deisenhofener Str. 38
81530 München
E-Mail: [INSERT EMAIL]

2. Erhobene Daten
- Name, E-Mail-Adresse, Passwort (gehasht)
- Nutzungsdaten (Login-Zeiten, genutzte Features)

3. Zweck der Verarbeitung
Bereitstellung der Services, Account-Verwaltung, Kundensupport.

4. Rechtsgrundlage
Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)

5. Speicherdauer
Daten werden gelöscht, wenn der Nutzer seinen Account löscht oder nach 2 Jahren Inaktivität.

6. Hosting
Daten werden bei [INSERT HOSTER, z.B. Supabase/AWS] in der EU gespeichert.

7. Ihre Rechte
Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit, Beschwerde bei der Datenschutzbehörde.

8. Kontakt für Datenschutz
[INSERT EMAIL]

Stand: Mai 2026
```

### Impressum (/impressum)

```
Impressum

Atheniks UG (haftungsbeschränkt)
Deisenhofener Str. 38
81530 München

Geschäftsführer: Maxim Neimeier

E-Mail: [INSERT EMAIL]

Handelsregister: München HRB [INSERT OR "in Gründung"]
USt-IdNr.: [INSERT OR "beantragt"]

Verantwortlich für den Inhalt nach § 55 RStV:
Maxim Neimeier
```

---

## Acceptance Criteria

- [ ] Registration form has 3 checkboxes (2 required, 1 optional)
- [ ] Button is disabled until required checkboxes are checked
- [ ] AGB page exists at `/agb` with content
- [ ] Datenschutz page exists at `/datenschutz` with content
- [ ] Impressum page exists at `/impressum` with content
- [ ] Footer links to all 3 pages on main page
- [ ] All checkboxes are NOT pre-selected by default
- [ ] Optional marketing checkbox is clearly marked as "optional"

---

## Notes

- **Company:** Atheniks UG (haftungsbeschränkt), Munich, Germany
- **Products:** Planer (budget planning) + Calculus (financial modeling)
- **Current status:** Free beta, no payment yet
- **Deadline:** Must be done before first beta users register (target: this week)
