# Atheniks Cloud - UI/UX Design Prompt

## Projektübersicht

**Atheniks Cloud** ist ein intelligenter Intake-Channel für alle Atheniks-Produkte (Planer, Calculus, Investa, Proviso, Asset Management). 

**Kernkonzept:** Nicht "noch ein Dropbox", sondern ein intelligenter Dokumenten-Hub, der mit KI Dokumente analysiert und automatisch in die passenden Atheniks-Produkte routet.

---

## Die Drei Phasen (MVP → Full)

### Phase 1: Store (MVP)
- Enterprise Storage mit Workspaces
- Drag & Drop Upload
- Ordner-Strukturen
- Sharing & Berechtigungen
- Versionierung

### Phase 2: Understand (AI Layer)
- KI liest jedes hochgeladene Dokument
- Automatische Kategorisierung
- Erste Integration: Excel-Budget → Planer (one-click import)

### Phase 3: Route (Full Integration)
- Automatisches Routing in passende Produkte
- Proviso: Verträge → automatische Rückstellungen
- Planer: Budgets → Forecasting
- Asset Management: Dokumente → Asset-Tracking

---

## UI-Anforderungen

### 1. Dashboard (Home)
**Ziel:** Schneller Überblick über alle Workspaces und Aktivitäten

**Elemente:**
- Willkommensbereich mit Nutzername
- "Neuer Workspace" Button (prominent)
- Liste der Workspaces (Kacheln oder Liste)
  - Workspace-Name
  - Letzte Aktivität
  - Anzahl Dokumente
  - Mitglieder-Avatare
- "Kürzlich bearbeitet" Section
- Upload-Button (Drag & Drop Zone)
- Sidebar-Navigation: Workspaces, Geteilt, Archiv

### 2. Workspace View
**Ziel:** Datei-Management wie Dropbox, aber cleaner

**Elemente:**
- Breadcrumb-Navigation (Workspace > Ordner > Unterordner)
- Datei-Liste mit:
  - Icon (PDF, Excel, Word, Bild)
  - Dateiname
  - Größe
  - Letzte Änderung
  - Besitzer
  - Status (wird verarbeitet / analysiert / geroutet)
- Drag & Drop Upload-Zone
- Kontext-Menü (Rechtsklick): Download, Teilen, Löschen, Versionen
- Ordner-Erstellen Button
- Filter: Alle, Dokumente, Bilder, Excel, Verträge

### 3. Upload & AI-Verarbeitung
**Ziel:** Nahtloser Upload mit KI-Analyse

**Elemente:**
- Upload-Progress mit Drag & Drop
- Während Upload: "Wird analysiert..." mit Spinner
- Nach Analyse: 
  - Dokument-Typ erkannt (z.B. "Vertrag", "Budget", "Rechnung")
  - Vorschlag: "In Proviso öffnen" / "In Planer importieren"
  - Konfidenz-Score (z.B. 95% Vertragsdokument)
- "Jetzt verarbeiten" Button
- "Später entscheiden" Option

### 4. Excel → Planer Integration (Phase 2 MVP)
**Ziel:** One-click Budget-Import

**Elemente:**
- Excel-Datei hochladen
- Vorschau der erkannten Daten (Tabellen)
- Mapping: "Spalte A → Budget-Kategorie"
- Preview des Imports
- "In Planer übertragen" Button
- Erfolgsmeldung mit Link zum Planer

### 5. Sharing & Berechtigungen
**Ziel:** Enterprise-grade Sharing

**Elemente:**
- "Teilen" Dialog
- Link erstellen (öffentlich / passwortgeschützt)
- Einladung per E-Mail
- Berechtigungen: Ansehen / Bearbeiten / Admin
- Ablaufdatum für Links
- Aktivitäts-Log (wer hat wann zugegriffen)

### 6. Mobile Responsive
**Ziel:** Vollständige Funktionalität auf Smartphone

**Elemente:**
- Touch-optimierte Navigation
- Mobile Upload (Kamera / Dateien)
- Swipe-Gesten für Dateien
- Kompakte Listenansicht

---

## Design-System

### Farben
- **Primary:** Atheniks Blau (#1E40AF oder ähnlich)
- **Secondary:** Grau-Skala für neutrale Elemente
- **Success:** Grün für erfolgreiche Aktionen
- **Warning:** Orange für Hinweise
- **Error:** Rot für Fehler
- **Background:** Hellgrau/Weiß für Clean Look

### Typografie
- **Headlines:** Inter oder SF Pro Display (modern, clean)
- **Body:** Inter oder SF Pro Text
- **Sizes:** 
  - H1: 32px
  - H2: 24px
  - Body: 16px
  - Small: 14px

### Komponenten
- **Buttons:** Rounded corners (8px), Primary filled, Secondary outlined
- **Cards:** Subtle shadow, rounded corners (12px), hover effect
- **Inputs:** Clean borders, focus state mit Primary color
- **Icons:** Lucide oder Heroicons (outline style)

---

## User Flows

### Flow 1: Erstbesuch
1. Landing Page mit Value Prop
2. "Workspace erstellen" CTA
3. Onboarding-Tour (3 Steps)
4. Erster Upload
5. "Willkommen bei Atheniks Cloud"

### Flow 2: Tägliche Nutzung
1. Login → Dashboard
2. Workspace auswählen
3. Datei hochladen (Drag & Drop)
4. KI-Analyse abwarten
5. Dokument öffnen oder in Produkt routen

### Flow 3: Excel-Import (Phase 2)
1. Excel-Datei hochladen
2. "Wird analysiert..."
3. "Budget erkannt!"
4. Preview der Daten
5. "In Planer importieren"
6. Erfolg → Link zu Planer

---

## Technische Anforderungen

- **Framework:** React / Vue / Angular (empfohlen: React mit Next.js)
- **Styling:** Tailwind CSS oder Styled Components
- **State Management:** Redux Toolkit oder Zustand
- **File Upload:** React Dropzone oder ähnlich
- **Icons:** Lucide React
- **Charts (später):** Recharts oder Chart.js
- **Animations:** Framer Motion für smooth transitions

---

## Deliverables

1. **Figma-Designs** oder **Code-Implementierung** für:
   - Dashboard
   - Workspace View
   - Upload mit AI-Feedback
   - Sharing Dialog
   - Mobile Views

2. **Design-System** mit:
   - Farbpalette
   - Typografie
   - Komponenten-Bibliothek

3. **Prototyp** mit:
   - Clickable Flows
   - Upload-Animation
   - AI-Verarbeitung Demo

---

## Besondere Hinweise

- **Clean & Minimal:** Weniger ist mehr (Dropbox-Style, nicht überladen)
- **Speed:** Schnelle Ladezeiten, progressive loading
- **AI-Transparenz:** Nutzer sollten verstehen, was die KI macht
- **Enterprise-Ready:** Berechtigungen, Audit-Logs, Security
- **Integration:** Nahtloser Übergang zu Atheniks-Produkten

---

**Kontext:** Atheniks ist ein B2B SaaS-Unternehmen für Finanzplanung (Planer, Calculus, Investa, Proviso, Asset Management). Die Cloud dient als intelligenter Einstiegspunkt, der Dokumente automatisch verarbeitet und in die passenden Produkte routet.

**Zielgruppe:** Controller, CFOs, Finance-Teams, Geschäftsführer (Enterprise-Kunden)

**Wettbewerber:** Dropbox, Google Drive, SharePoint — aber mit KI-Intelligenz und Atheniks-Integration
