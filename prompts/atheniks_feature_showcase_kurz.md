# PROMPT: Atheniks Plattform Section

Erstelle eine interaktive Landing Page Section fur die Atheniks Website. Navigation links, Content rechts. Nur ein Feature ist jeweils sichtbar.

---

## Uberschrift

**DIE ATHENIKS PLATTFORM**
Daten verbinden. KI nutzen. Entscheidungen treffen.

---

## Layout

- Links: Vertikale Navigation (280px), 6 klickbare Punkte
- Rechts: Grosser Content-Bereich (Restbreite)
- Nur EIN Feature ist jeweils sichtbar
- Wechsel per Klick mit Fade-Animation (150ms out, 300ms in)

---

## Navigation

Aktiver Punkt: Blauer Hintergrund (#3b82f6), weisser fetter Text, 3px blauer Balken links
Inaktiv: Grauer Text (#94a3b8), transparent, Hover -> #1e293b Hintergrund

---

## Die 6 Features

### 1. Plattform (Default)
**Titel:** Plattform
**Text:** Atheniks ist keine isolierte Software, sondern eine integrierte Plattform. Alle Module greifen auf dieselbe Datenbasis zu — ohne Silos, ohne Duplikate, ohne Integrationschaos.
**Visual:** Abstrakter Layer-Stack. Zentrales blaues Hexagon, darum 6 verbundene Formen (die Module), verbunden durch leuchtende Linien. Pulsierende Animation.

### 2. Data Warehouse
**Titel:** Data Warehouse
**Text:** Ihr Single Source of Truth. Alle Unternehmensdaten aus ERP, CRM, Excel, Banken — strukturiert, versioniert, GoBD-konform an einem Ort.
**Visual:** Zentraler Datenbank-Zylinder, von allen Seiten stroemen farbige Datenstroeme rein (grun ERP, orange CRM, gelb Excel, blau Banken). Strome vermischen sich nicht, werden im Zentrum sortiert.

### 3. KI Engine
**Titel:** KI Engine
**Text:** Fragen Sie Ihre Daten auf Deutsch. Die KI Engine interpretiert, analysiert und liefert Antworten in Sekunden — ohne SQL, ohne Excel, ohne Data-Science-Team.
**Visual:** Chat-Interface links (Frage + Antwortblase), rechts das Data Warehouse, verbunden durch pulsierende Datenlinien mit Partikeln.

### 4. Finanzanalyse
**Titel:** Finanzanalyse
**Text:** Budgetplanung, ROI-Analyse, Asset-Portfolio — alle Kennzahlen in Echtzeit. Dashboards, die zeigen wo Sie stehen. Forecasts, die zeigen wohin Sie gehen.
**Visual:** Stilisiertes Dashboard aus 4-6 Kacheln. Linienchart, Donut-Chart, grosse Kennzahl, Balkendiagramm. Glassmorphism-Look. Charts zeichnen sich auf.

### 5. Datenintegration
**Titel:** Datenintegration
**Text:** SAP, DATEV, Salesforce, Excel, Bank-APIs — Atheniks integriert alle Quellen automatisch. ETL-Pipelines im Hintergrund, ohne manuelle Imports.
**Visual:** 5-6 stilisierte Quadrate (Datenquellen), verbunden durch geschwungene Pipelines zu einem zentralen Hub. Partikel fliessen entlang der Linien.

### 6. Planung & Forecasting
**Titel:** Planung & Forecasting
**Text:** Was-waere-wenn-Szenarien in Minuten statt Wochen. Top-Down, Bottom-Up, Szenario-Vergleiche, automatische Forecasts — auf Basis echter Echtzeitdaten.
**Visual:** Linienchart mit 3 Linien. Blau: Tatsaechlich. Gruen: Optimistisch. Orange: Pessimistisch. Schieberegler-Icon in der Mitte. Linien zeichnen sich auf.

---

## Design

**Farben:**
- Section-Hintergrund: #0f172a
- Content-Hintergrund: #1e293b
- Aktiv-Blau: #3b82f6
- Text weiss: #ffffff
- Text grau: #94a3b8, #cbd5e1
- Hover-Blau: #2563eb

**Typografie:**
- Uberschrift: 48px fett
- Subheadline: 20px normal
- Content-Titel: 32px fett
- Content-Text: 16px normal, max 480px, line-height 1.7
- Nav-Text: 16px

**Animation:**
- Nav-Wechsel: 200ms ease-out
- Content fade-out: 150ms
- Content fade-in: 300ms
- Icon skaliert 0.8 -> 1.0: 400ms
- Text translateY 20px -> 0: 400ms staggered
- Auto-Rotation: Alle 6 Sekunden (stoppt bei Hover/Klick)

---

## Responsive

**Tablet:** Navigation oben (horizontal, scrollbare Tabs), Content unten
**Mobile:** Horizontal swipeable Tabs, Content volle Breite, Auto-Rotation aus

---

## CTA-Bereich (unten)

Made in Germany · GoBD-konform · DSGVO-konform

[ Demo buchen ] [ Produkte ansehen ]

---

## Technisch

- React mit useState fuer aktives Feature
- Framer Motion oder CSS Transitions
- SVG-Icons (Lucide/Heroicons), KEINE Emojis
- ARIA Tabs Pattern, Keyboard-Navigation (Pfeiltasten)
- Lazy-Loading fuer Visuals

---

## Stil

Dark Mode, clean, tech-forward, professionell. Isometrische oder flache stilisierte Illustrationen (keine Stock-Fotos). Blaue Akzente auf dunklem Grund. Deutsche Engineering-Qualitaet.

---

Referenzen: Stripe Features, Linear Features, Vercel Features
