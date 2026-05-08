# Atheniks Cloud – Product Strategy Brief

**Status:** Konzept / Strategie-Dokument  
**Datum:** März 2026  
**Vertraulichkeit:** Internal — Confidential

---

## 1. Executive Summary

**Atheniks Cloud** ist eine KI-gestützte Dokumenten-Intake- und Verarbeitungsplattform für deutsche KMU (5–150 Mitarbeiter). Sie ermöglicht es jedem Nutzer – unabhängig von Buchhaltungswissen – Finanzdokumente hochzuladen, die automatisch gelesen, klassifiziert, mit strukturierten Metadaten angereichert, gegen Banktransaktionen abgeglichen und in DATEV exportiert oder in das Atheniks-Produkt-Ökosystem geroutet werden.

**Kernpositionierung:** Die zero-effort Dokumenten-Intake-Schicht für KMU-Besitzer – gleichzeitig das Eingangstor zur gesamten Atheniks-Plattform.

---

## 2. Was ist Atheniks Cloud?

Eine intelligente Cloud-Storage- und Dokumentenverarbeitungsplattform für buchhaltungsrelevante Dokumente. Zielgruppe: KMU-Inhaber, Gründer und Finanzmanager, die ihre Dokumente organisiert, verarbeitet und DATEV-bereit brauchen – ohne manuellen Aufwand.

### Kernfunktionalität

| Funktion | Beschreibung |
|----------|--------------|
| **Dokumenten-Intake** | Alle Dateitypen: PDF, JPG, PNG, CSV, XML (XRechnung/ZUGFeRD), DOCX, E-Mail-Anhänge, mobile Scans |
| **KI-OCR & Extraktion** | Volltext-Extraktion mit Feld-Level-Parsing: Beträge, Daten, IBANs, USt-IDs, Verkäufer, Positionsdetails |
| **Automatische Klassifikation** | Dokumente sortiert in: Eingangsrechnung, Ausgangsrechnung, Kontoauszug, Beleg/Ausgabe, Vertrag, Steuerdokument, Sonstiges |
| **Bank-Abgleich** | PSD2/Open Banking – extrahierte Dokumentendaten automatisch gegen Banktransaktionen gematched |
| **DATEV-Export** | Manueler One-Click-Export (DATEV-Format) und automatischer Hintergrund-Sync via DATEV Connect API |
| **GoBD-Compliance** | Revisionssichere Archivierung out-of-the-box – jedes Dokument zeitgestempelt, unveränderlich, Audit-Log |
| **Ecosystem-Routing** | Klassifizierte Dokumente und Metadaten automatisch an verbundene Atheniks-Produkte geroutet |

---

## 3. Wettbewerbsanalyse

| Konkurrent | Fokus | DATEV | Bank | AI-Klassifikation | Target | Bedrohung |
|------------|-------|-------|------|-------------------|--------|-----------|
| **Finmatics** | AI-Dokumentenverarbeitung + DATEV-Automatisierung | ✅ | ✅ | ✅ | Steuerberater/Kanzleien | **Hoch** – Strategisch ähnlich, aber B2B2C |
| **BuchhaltungsButler** | AI-Buchhaltung + Bank-Sync | ✅ | ✅ | Teilweise | SMB Self-Service | **Hoch** – Direktester Konkurrent |
| **sevDesk** | SMB Cloud-Accounting | Export | ✅ | Teilweise | Freelancer, SMB | **Mittel** |
| **lexoffice** | Full Accounting Suite | Export | ✅ | Basis | SMB, Freelancer | **Mittel** |
| **ELO for DATEV** | Enterprise DMS + DATEV | Deep | ❌ | ❌ | Mid-Market, Enterprise | **Niedrig** |
| **d.velop** | Document Management + DATEV | Deep | ❌ | ❌ | Mid-Market, Enterprise | **Niedrig** |
| **Dext (Receipt Bank)** | Receipt Capture + Export | Limitiert | ❌ | ✅ | SMB, Accountants | **Mittel** |
| **DATEV** | Full Accounting Platform | Native | ✅ | Verbessernd | Steuerberater | **Niedrig** – Kein SMB-Direct-Service |

**Wichtige Erkenntnis:** Kein Konkurrent kombiniert derzeit: (a) Zero-Effort-SMB-Positionierung, (b) tiefe KI-Dokumentenklassifikation, (c) DATEV-Integration, und (d) Ökosystem-Verbindung.

---

## 4. Differenzierungsstrategie

### Die fünf Differenzierungs-Säulen

1. **Zero-Effort Promise**
   - Wettbewerber bieten Tools zum Sortieren/Kategorisieren, aber erfordern aktive Teilnahme
   - Atheniks Cloud: Der SMB-Inhaber muss nie über Dokumentenmanagement nachdenken

2. **SMB-Inhaber als Primärkunde (nicht die Kanzlei)**
   - Finmatics und andere haben den Steuerberater als Käufer
   - Atheniks Cloud: Direkter Vertrieb an SMB-Inhaber

3. **Ökosystem als Burggraben**
   - Standalone-Dokumententools werden kommodisiert
   - Atheniks Cloud's Verteidigung: Tief in der Atheniks-Plattform eingebettet

4. **Compliance als Default, nicht als Feature**
   - GoBD-Compliance, XRechnung/ZUGFeRD, revisionssichere Archivierung als unsichtbare Garantie

5. **Steuerberater als Kanal, nicht Konkurrenz**
   - Keine Ersetzung des Steuerberaters, sondern Effizienzsteigerung für ihn
   - Steuerberater empfiehlt Atheniks Cloud → sauberere DATEV-Daten

---

## 5. Unique Selling Proposition (USP)

### Primärer USP
> **Atheniks Cloud ist die Zero-Effort-Intake-Schicht für deutsche KMU – das einzige Produkt, das jedes Finanzdokument in strukturierte, DATEV-bereite, GoBD-konforme Daten transformiert und automatisch durch das gesamte Atheniks-Ökosystem routet, ohne Buchhaltungswissen vom Nutzer zu erfordern.**

**In einem Satz:** "Upload anything. Atheniks handles the rest."

### Sekundäre USPs

- **E-Mail-Intake-Adresse** – Dokumente kommen automatisch an (belege@company.atheniks.de)
- **XRechnung/ZUGFeRD nativ** – Pflicht seit Januar 2025, viele Konkurrenten noch nicht auf dem Stand
- **KI-Confidence-Transparenz** – Jede Klassifikation zeigt Confidence-Score für vertrauenswürdige Entscheidungen
- **Multi-Tenant für Kanzleien** – Steuerberater können mehrere Mandanten in einem Dashboard verwalten

---

## 6. Ökosystem-Integration

| Produkt | Wie Atheniks Cloud integriert |
|---------|------------------------------|
| **Ledgera** | Rechnungen, Kontoauszüge, Belege fließen als strukturierte Transaktionsdaten ein. Atheniks Cloud wird primärer Intake-Layer für ERP-Integrationen. |
| **Proviso** | Verträge und wiederkehrende Rechnungen automatisch ausgelöst für Rückstellungen. Keine manuelle Eingabe nötig. |
| **Planer** | Tatsächliche Ausgaben aus verarbeiteten Rechnungen und Belegen feeden in Planer für Budget-vs.-Actual-Tracking. |
| **Atheniks AI** | Alle hochgeladenen Dokumente werden per Natural Language abfragbar: "Zeige alle Rechnungen von Lieferant X über EUR 5.000" |
| **Calculus** | Projektspezifische Kostendokumente (Belege, Subunternehmer-Rechnungen) an Calculus für Echtzeit-Projektprofitabilität. |
| **Investa** | Investitionsrelevante Dokumente (Verträge, CAPEX-Rechnungen, LOIs) getaggt und an Investa geroutet. |
| **Meridian (AssetMgmt)** | Anschaffungsrechnungen für Assets triggern Asset-Einträge in Meridian mit automatischem AfA-Plan. |
| **Industry Solutions** | Branchenspezifische Dokumente (z.B. HOAI-Verträge für Construction, Grid-Rechnungen für Helios) klassifiziert und geroutet. |

### Die Ökosystem-Vision: Atheniks Cloud als Front Door

**Der Flow:** Ein Nutzer lädt eine Rechnung in Atheniks Cloud hoch. Innerhalb von Sekunden:
1. Rechnungsbetrag aktualisiert Planer's Actuals
2. Wiederkehrender Vertrag triggert Proviso-Rückstellung
3. Lieferant wird in Ledgera geloggt
4. Daten werden via Atheniks AI abfragbar

**Keine doppelte Dateneingabe. Keine manuelle Abstimmung zwischen Tools. Ein Dokument rein – gesamte Plattform aktualisiert.**

---

## 7. Strategische Empfehlungen

### Go-to-Market

1. **Direkter Launch an SMB-Inhaber** – Website Self-Service, Kreditkarte, Free Trial
2. **Steuerberater-Partnerprogramm aufbauen** – Kanzleien empfehlen Atheniks Cloud für sauberere DATEV-Daten
3. **Compliance-Messaging führen** – "Ab Tag 1 GoBD-konform" ist hochdringender, aber wenig bekannter Pain Point
4. **XRechnung als Hook nutzen** – Pflicht-E-Rechnung ab 2025 ist konkreter, zeitnaher Grund zum Wechseln

### Naming & Positioning

Der Name "Atheniks Cloud" funktioniert intern gut. Für externes SMB-Marketing: Sub-Brand oder Tagline, das das Zero-Effort-Versprechen kommuniziert – z.B. "Atheniks Inbox" oder "Atheniks Vault".

**Vermeiden:** "AI Buchhalter" – das Produkt ersetzt noch nicht den Steuerberater. "AI-powered document intelligence" oder "your automated accounting inbox" sind genauere Claims.

### Erfolgs-Metriken

| Metrik | Ziel |
|--------|------|
| **Activation Rate** | % der Nutzer, die innerhalb 24h nach Sign-up ihr erstes Dokument hochladen |
| **Dokumentenverarbeitungs-Genauigkeit** | AI-Klassifikations-Genauigkeit (Ziel: >95% auf gängigen Dokumententypen) |
| **DATEV-Export-Rate** | % der verarbeiteten Dokumente, erfolgreich nach DATEV exportiert |
| **Ecosystem Attachment Rate** | % der Atheniks Cloud-Kunden, die innerhalb 90 Tagen mindestens ein weiteres Atheniks-Produkt nutzen |
| **Steuerberater-Referral-Rate** | % der neue Sign-ups, die aus einer Kanzlei-Empfehlung stammen |

---

## 8. Risiken

- **Finmatics pivotet zu SMB-Direct** → Wenn Finmatics Self-Service SMB-Produkt launcht, steigt Wettbewerbsdruck
- **DATEV baut das nativ** → DATEV Unternehmen Online erweitert KI-Features → DATEV-Bridge-Wertproposition reduziert sich
- **KI-Klassifikationsgenauigkeit** → Fehlklassifikationen bei Steuererklärungen = schwerer Vertrauensschaden

---

*Dokument erstellt: März 2026 · Atheniks Strategy Team · Confidential*
