# Atheniks Cloud — Product Vision

**Titel:** Intelligent Enterprise Storage. From file storage to the financial brain of your business.  
**Status:** Product Vision · Confidential · 2026  
**Folien:** 12

---

## Slide 1: Titel

**Atheniks Cloud**  
Intelligent Enterprise Storage. From file storage to the financial brain of your business.

---

## Slide 2: The Problem

**Companies are drowning in document chaos.**

| Problem | Beschreibung |
|---------|--------------|
| **Files everywhere** | Email attachments, local drives, WhatsApp, SharePoint. Nobody knows which version is current. |
| **No context** | "Quote_final_v3_FINAL.pdf" says nothing. The content stays hidden until someone opens it. |
| **Sharing is chaos** | Shared too widely, accessible too long, no audit trail. Security and compliance remain wishful thinking. |
| **Data sleeps** | Contracts, invoices and budget plans sit in storage — but never flow automatically into the next system. |

---

## Slide 3: Atheniks Cloud ist nicht nur Speicher

**Es ist die Schicht durch die alle Unternehmensdokumente fließen — und automatisch in das richtige Atheniks-Produkt konvertiert werden.**

**Drei Schritte:**
1. **Store** — Structured, secure, accessible to the right team.
2. **Understand** — AI reads every upload and recognises what is inside.
3. **Route** — Directly into Proviso, Meridian, Planer, Ledgera.

---

## Slide 4: Strategic Advantage

**Warum wir das bauen sollten — und warum jetzt:**

| # | Vorteil | Erklärung |
|---|---------|-----------|
| 01 | **Existing customers are the market** | Jeder Proviso-, Meridian- und Planer-Kunde hat bereits Dokumente, die zu diesen Produkten gehören. Kein neues Akquisitionsproblem — sondern ein Upsell in bestehende Kundenbasis. |
| 02 | **No competition against Google and Dropbox** | Wir bauen keinen generischen File Store. Wir bauen den intelligenten Intake-Channel für Atheniks. Google Drive kann keine Rechnung in einen Ledgera-Journal-Eintrag verwandeln. Wir können das. |
| 03 | **Storage makes every other product better** | Planer bekommt Budget-Daten aus echten Excel-Files. Proviso bekommt Vertragsdaten beim Upload. Meridian bekommt Kaufbelege direkt. Storage reduziert Time-to-Value über das gesamte Portfolio. |
| 04 | **Lock-in through data, not through contract** | Wenn Kundendokumente, Vertragshistorie und Audit-Logs in Atheniks leben, entstehen natürliche Switching Costs. Das stärkt Retention über den gesamten Produkt-Stack ohne langfristige Verträge. |

---

## Slide 5: Tier 1 — MVP (Must-Have)

**Vier Features ohne die das Produkt nicht funktioniert:**

1. **Smart Sharing with Access Logic**  
   Share with expiry date, permission level and open notification — all in one step. No separate permissions menu.

2. **Group Workspaces with Roles**  
   Workspaces per project or team. Roles: Viewer, Contributor, Owner. Add a new team member once — they instantly see all relevant files.

3. **Activity Feed per File**  
   Who uploaded, opened, commented, or added a new version. Replaces the "Has anyone seen the file?" Slack thread.

4. **File Request Function**  
   Send a file request to a person or group. They upload, the file lands automatically in the right workspace. No email attachment.

---

## Slide 6: Tier 2 und 3

### Tier 2 — v1.1

| Feature | Beschreibung |
|---------|--------------|
| **AI File Context** | Automatic one-line summary of the file content displayed directly in the list view. Filename replaced by actual meaning. |
| **Expiry Dates and Reminders** | Set an expiry date directly on any file. Automatic notification before it lapses. Visual colour indicator in the list. |
| **Inline Annotations** | Attach a note to a file directly from the list view — visible as a label for all team members, without opening the file. |

### Tier 3 — v2.0

| Feature | Beschreibung |
|---------|--------------|
| **Version Control + Diff View** | Visual comparison between two document versions on demand. Highly relevant for contracts and reports. |
| **AI Duplicate Detection** | Detect content-level duplicates, not just identical files. Most useful once a critical volume of documents exists. |
| **Access Audit Log** | Exportable log for GDPR, GoBD and ISO 27001 compliance. Essential for enterprise customers. |

---

## Slide 7: AI Layer

**The AI understands every upload and knows exactly where it belongs.**

**Workflow:**
```
File Upload
    ↓
AI detects document type + content
    ↓
Contract detected → Proviso: suggest accrual
Asset purchase detected → Meridian: create asset
Budget plan detected → Planer: import project
Annual report detected → Ledgera: journal entry suggestion
```

**Dokumente kommen einmal rein. Die AI entscheidet, was als Nächstes passiert.**

---

## Slide 8: Feature Spotlight

**Excel budget → Planer project in one click.**

Die erste konkrete AI-to-Product Feature: Budget-Pläne aus Excel werden automatisch in strukturierte Planer-Projekte konvertiert.

**Schritte:**
1. **Button in the file list** — "Import to Planer" appears next to every .xlsx file.
2. **AI reads the structure** — Cost centers, months, values, sum rows — automatically, without a template.
3. **Review modal with clarifying questions** — Max. 3 questions if the structure is ambiguous. Mapping confirmed in 30 seconds.
4. **Project created in Planer** — All cost centers and monthly values imported instantly. Deep-link opens Planer directly.

**Warum das wichtig ist:** Jeder Atheniks-Kunde hat bereits ein Excel-Budget. Storage macht Planer sofort nutzbar — keine leere Startseite.

---

## Slide 9: Product Integration

**The cloud storage as the intake channel for the entire Atheniks portfolio.**

| Produkt | Input | AI Action |
|---------|-------|-----------|
| **Proviso** | Contracts | Suggest accruals |
| **Meridian** | Purchase receipts & leases | Create asset + depreciation |
| **Planer** | Excel budgets | Import project |
| **Ledgera** | Invoices & P&L reports | Journal entry suggestion |
| **Calculus** | Quotes & financing contracts | Pre-fill cash flow model |

---

## Slide 10: Technical

**Supported file types by priority:**

| Priorität | Formate |
|-----------|---------|
| **Launch** | PDF, DOCX, XLSX, PPTX, JPG/PNG, SVG, TXT, ZIP |
| **v1.1** | ODT/ODS, CSV, MSG/EML, MP4 |
| **Industry-specific** | DWG/DXF (Plans), IFC (BIM), DATEV-XML, EDI (Logistics) |

**Browser preview** (no download required): PDF, DOCX, XLSX, JPG, PNG, SVG  
**All other types:** download only.

---

## Slide 11: Recommendation — Phased Approach

### Phase 1: MVP — Storage + Sharing + Workspaces
Build Tier-1 features: Smart Sharing, Groups with Roles, Activity Feed, File Request.  
**A solid cloud storage product that works from day one.**

### Phase 2: AI Layer + first product connection
Excel-to-Planer import as the first AI feature.  
AI file context in the list view.  
Expiry dates and inline annotations.

### Phase 3: Full product integration
Connect Proviso, Meridian, Ledgera, Calculus and Investa.  
Document classification for all file types.  
Access audit log for enterprise.

---

## Slide 12: Summary

**Atheniks Cloud — The storage that thinks.**

- Tier-1 features as a fully usable enterprise storage product from day one
- AI layer that understands documents and routes them into the right product
- Intake channel for Proviso, Meridian, Planer, Ledgera, Calculus, Investa
- Natural upsell for existing customers — no new sales problem

**Ready for the meeting.**

---

## Zusammenfassung

**Atheniks Cloud ist:**
1. **Enterprise Storage** (MVP: Sharing, Workspaces, Activity Feed)
2. **AI-Dokumentenverständnis** (Automatische Klassifizierung & Routing)
3. **Intake-Channel** für alle Atheniks-Produkte (Proviso, Meridian, Planer, Ledgera, Calculus, Investa)

**Kernidee:** Dokumente werden einmal hochgeladen. Die AI erkennt den Inhalt und routet automatisch in das passende Produkt.

**Erste Integration:** Excel → Planer (Budget-Import)

**Strategischer Wert:** Upsell in bestehende Kunden, Lock-in durch Daten, keine Konkurrenz zu Google/Dropbox (weil intelligent/integriert).

---
Quelle: atheniks-cloud-vision-en.pptx (12 Folien)
