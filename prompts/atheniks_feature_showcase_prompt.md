# PROMPT: Atheniks Plattform Feature Showcase — Landing Page Section

## AUFGABE

Erstelle eine interaktive Landing Page Section für die Atheniks Website (atheniks.com). Die Section zeigt 6 Features der Atheniks Plattform. Der Nutzer klickt auf einen der 6 Navigationspunkte links, und rechts erscheint das zugehörige Feature mit Icon, Titel, Beschreibung und einer stilisierten Visualisierung/Illustration.

---

## SECTION-ÜBERSCHRIFT

**Hauptüberschrift (48px, fett, weiß, zentriert):**
DIE ATHENIKS PLATTFORM

**Subheadline (20px, normal, grau #94a3b8, zentriert, Abstand nach unten 80px):**
Daten verbinden. KI nutzen. Entscheidungen treffen.

---

## LAYOUT: ZWEISPALTIG

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│                    DIE ATHENIKS PLATTFORM                           │
│            Daten verbinden. KI nutzen. Entscheidungen treffen.      │
│                                                                     │
│   ┌──────────────┐  ┌────────────────────────────────────────────┐ │
│   │              │  │                                            │ │
│   │  NAVIGATION  │  │                                            │ │
│   │  (Links)     │  │        FEATURE CONTENT (Rechts)            │ │
│   │  280px       │  │                                            │ │
│   │              │  │   [VISUALISIERUNG / ILLUSTRATION]          │ │
│   │  ● Plattform │  │                                            │ │
│   │    Data      │  │   Feature Titel                            │ │
│   │    Warehouse │  │                                            │ │
│   │    KI Engine │  │   Beschreibungstext                        │ │
│   │    Finanz-   │  │   (3-4 Sätze)                              │ │
│   │    analyse   │  │                                            │ │
│   │    Daten-    │  │   [CTA-Link]                               │ │
│   │    integration│ │                                            │ │
│   │    Planung &  │  │                                            │ │
│   │    Forecasting│  │                                            │ │
│   │              │  │                                            │ │
│   └──────────────┘  └────────────────────────────────────────────┘ │
│                                                                     │
│   ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│          Made in Germany · GoBD-konform · DSGVO-konform            │
│                                                                     │
│              [ Demo buchen ]    [ Produkte ansehen ]               │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## FARBSCHEMA

| Element | Hex-Code |
|---------|----------|
| Section-Hintergrund | #0f172a (dunkelblau) |
| Content-Bereich Hintergrund | #1e293b |
| Nav-Background (aktiv) | #3b82f6 |
| Nav-Text (aktiv) | #ffffff |
| Nav-Text (inaktiv) | #94a3b8 |
| Nav-Hover | #1e293b Hintergrund, weißer Text |
| Content-Titel | #ffffff |
| Content-Text | #cbd5e1 |
| Akzent/Icon | #3b82f6 |
| CTA-Button | #3b82f6 |
| CTA-Button Hover | #2563eb |

---

## NAVIGATION (LINKS, 280px BREIT)

6 klickbare Navigationspunkte, vertikal untereinander, Abstand 8px.

**Aktiver Punkt (z.B. "Plattform"):**
- Hintergrund: #3b82f6
- Text: weiß, fett, 16px
- Linker Rand: 3px blauer Balken
- Padding: 16px 24px
- Border-Radius: 8px

**Inaktive Punkte:**
- Hintergrund: transparent
- Text: #94a3b8, normal, 16px
- Padding: 16px 24px
- Border-Radius: 8px
- Hover: Hintergrund #1e293b, Text weiß

**Animation bei Klick:**
- Aktiver Punkt wechselt mit sanftem Farbübergang (200ms, ease-out)
- Content-Bereich rechts fade-out (150ms) → wechselt → fade-in (300ms)

---

## FEATURE 1 — PLATTFORM (Default beim ersten Laden)

**Navigations-Label:** Plattform

**Content-Bereich (Rechts):**

**Icon:** 🏗️ (48px, blau #3b82f6)

**Titel (32px, fett, weiß):**
Plattform

**Beschreibung (16px, normal, #cbd5e1, max-width 480px, line-height 1.7):**
Atheniks ist keine isolierte Software, sondern eine integrierte Plattform. Alle Module greifen auf dieselbe Datenbasis zu — ohne Silos, ohne Duplikate, ohne Integrationschaos. Ein Ecosystem, das mit Ihrem Unternehmen wächst.

### VISUALISIERUNG FÜR PLATTFORM:

**Empfohlene Visual:** Abstrakte Layer-Stack-Illustration

**Beschreibung für Designer/Illustrator:**
- Ein zentrales, leuchtendes blaues Hexagon oder Quadrat in der Mitte
- Darum herum 6 kleinere, verbundene Formen (die 6 Module: Planer, Calculus, Investa, Ledgera, Proviso, Meridian)
- Die Formen sind durch dünne, leuchtende blaue Linien mit dem Zentrum verbunden
- Stil: Clean, minimalistisch, tech-forward, isometrisch oder flach
- Farben: Dunkelblauer Hintergrund (#0f172a), blaue Akzente (#3b82f6), weiße Highlights
- Animation (optional): Die Verbindungslinien pulsanieren sanft, die äußeren Formen schweben leicht
- Alternative: Ein konzentrisches Kreisdiagramm mit 6 Segmenten, die sich langsam drehen

**Fallback (wenn keine Illustration möglich):**
- Ein großes, animiertes SVG-Icon: Verbundene Knotenpunkte (Network-Graph)
- Oder: Ein stilisierter 3D-Stack aus Ebenen (wie ein Layer-Cake aus Daten)

---

## FEATURE 2 — DATA WAREHOUSE

**Navigations-Label:** Data Warehouse

**Content-Bereich (Rechts):**

**Icon:** 🗄️ (48px, blau #3b82f6)

**Titel (32px, fett, weiß):**
Data Warehouse

**Beschreibung (16px, normal, #cbd5e1, max-width 480px, line-height 1.7):**
Ihr Single Source of Truth. Alle Unternehmensdaten — aus ERP, CRM, Excel, Banken — strukturiert und versioniert an einem Ort. GoBD-konform, audit-sicher und jederzeit abrufbar. Das Fundament für alle Analysen.

### VISUALISIERUNG FÜR DATA WAREHOUSE:

**Empfohlene Visual:** Stilisierter Datenbank-Server mit Datenströmen

**Beschreibung für Designer/Illustrator:**
- Ein zentrales, futuristisches Datenbank-Symbol (zylindrische Form, wie ein klassisches Datenbank-Icon, aber modern und leuchtend)
- Von oben, unten und den Seiten strömen farbige Datenströme in das Zentrum
- Die Datenströme sind stilisiert: kleine Rechtecke/Punkte, die wie Wasserströme fließen
- Jeder Datenstrom hat eine eigene Farbe (z.B. grün für ERP, orange für CRM, gelb für Excel, blau für Banken)
- Die Ströme vermischen sich NICHT — sie bleiben getrennt, bis sie im Zentrum sortiert und strukturiert werden
- Stil: Isometrisch, leicht 3D, aber clean und nicht überladen
- Animation (optional): Die Datenströme fließen kontinuierlich, die Zentraleinheit pulsiert sanft
- Alternative: Ein stilisierter Bergkristall oder Prismen-Effekt — viele Datenströme gehen rein, eine klare Struktur kommt raus

**Fallback:**
- Animierter SVG: Ein Zylinder, aus dem nach oben strukturierte Daten-Spalten aufsteigen (wie ein Brunnen)

---

## FEATURE 3 — KI ENGINE

**Navigations-Label:** KI Engine

**Content-Bereich (Rechts):**

**Icon:** 🧠 (48px, blau #3b82f6)

**Titel (32px, fett, weiß):**
KI Engine

**Beschreibung (16px, normal, #cbd5e1, max-width 480px, line-height 1.7):**
Fragen Sie Ihre Daten auf Deutsch: "Wie entwickelt sich unser Cash-Flow bei 20 Prozent mehr Personal?" Die KI Engine interpretiert, analysiert und liefert Antworten in Sekunden — ohne SQL, ohne Excel, ohne Data-Science-Team.

### VISUALISIERUNG FÜR KI ENGINE:

**Empfohlene Visual:** Chat-Interface mit leuchtenden Verbindungen zum Datenbank-Symbol

**Beschreibung für Designer/Illustrator:**
- Links: Ein stilisierter Chat-Blasen-Dialog (wie iMessage, aber minimalistisch)
  - Obere Blase: "Wie entwickelt sich unser Cash-Flow bei 20% mehr Personal?" (grau, halbtransparent)
  - Untere Blase: Eine leuchtend blaue Antwortblase mit einem Chart/Symbol drin (leuchtend, aktiv)
- Rechts: Das Data-Warehouse-Symbol aus Feature 2, verbunden mit der Chat-Blase durch leuchtende, pulsierende Linien
- Die Verbindungslinien haben kleine Partikel, die sich bewegen (Datenfluss)
- Hintergrund: Dunkel, subtiler Glow um die Chat-Blasen und das Warehouse
- Stil: Clean, modern, leicht futuristisch
- Animation: Die Antwortblase erscheint mit einem sanften Pop, die Verbindungslinien pulsieren
- Alternative: Ein Gehirn-Symbol, das aus leuchtenden Knotenpunkten besteht (Neural Network-Style), verbunden mit Datensymbolen

**Fallback:**
- Typewriter-Effekt: Der Text "Wie entwickelt sich unser Cash-Flow..." schreibt sich selbst, gefolgt von einer leuchtenden Antwort

---

## FEATURE 4 — FINANZANALYSE

**Navigations-Label:** Finanzanalyse

**Content-Bereich (Rechts):**

**Icon:** 📊 (48px, blau #3b82f6)

**Titel (32px, fett, weiß):**
Finanzanalyse

**Beschreibung (16px, normal, #cbd5e1, max-width 480px, line-height 1.7):**
Von Budgetplanung über ROI-Analyse bis zum Asset-Portfolio: Alle Finanzkennzahlen in Echtzeit. Dashboards, die sofort zeigen, wo Sie stehen — und Forecasts, die zeigen, wohin Sie gehen können.

### VISUALISIERUNG FÜR FINANZANALYSE:

**Empfohlene Visual:** Stilisiertes Dashboard mit Charts und Kennzahlen

**Beschreibung für Designer/Illustrator:**
- Ein abstraktes, stilisiertes Dashboard aus 4-6 Kacheln/Karten
- Jede Karte zeigt einen anderen Chart-Typ:
  - Oben links: Ein Linienchart mit Trend nach oben (grün/blau)
  - Oben rechts: Ein Kreisdiagramm (Donut-Chart) mit Segmenten
  - Mitte: Eine große Zahl/Kennzahl (z.B. "+23%" oder "€2.4M") in fett und leuchtend
  - Unten links: Ein Balkendiagramm mit 5-6 Balken
  - Unten rechts: Eine kleine Tabelle oder Liste mit 3 Zeilen
- Alle Charts sind stilisiert, nicht detailliert (keine Achsenbeschriftungen, nur Formen)
- Farben: Blau-Töne für positiv, subtiler Rot/Orange für Warnungen, weiß für Text
- Stil: Flach, modern, mit leichtem Glassmorphism-Effekt (subtile Transparenz)
- Animation: Die Charts zeichnen sich beim Erscheinen nach und nach (Linien füllen sich, Balken wachsen)
- Alternative: Ein 3D-Raum aus schwebenden Datenkarten, die sich leicht drehen

**Fallback:**
- Animierter SVG: Ein Linienchart, das sich von links nach rechts aufzeichnet

---

## FEATURE 5 — DATENINTEGRATION

**Navigations-Label:** Datenintegration

**Content-Bereich (Rechts):**

**Icon:** 🔗 (48px, blau #3b82f6)

**Titel (32px, fett, weiß):**
Datenintegration

**Beschreibung (16px, normal, #cbd5e1, max-width 480px, line-height 1.7):**
SAP, DATEV, Salesforce, Excel, Bank-APIs — Atheniks integriert alle Ihre Datenquellen automatisch. ETL-Pipelines, die im Hintergrund laufen, ohne manuelle Imports oder veraltete CSV-Exports.

### VISUALISIERUNG FÜR DATENINTEGRATION:

**Empfohlene Visual:** Logos/Systeme, die durch Pipelines verbunden sind

**Beschreibung für Designer/Illustrator:**
- 5-6 stilisierte Quadrate/Rechtecke, die verschiedene Datenquellen repräsentieren:
  - Grünes Quadrat: SAP
  - Blaues Quadrat: DATEV
  - Hellblaues Quadrat: Salesforce
  - Gelbes Quadrat: Excel
  - Dunkelblaues Quadrat: Bank-API
- Jedes Quadrat hat ein minimalistisches Icon/Symbol (keine echten Logos aus Lizenzgründen, sondern stilisierte Darstellungen)
- Die Quadrate sind durch geschwungene, leuchtende Linien (Pipelines) verbunden
- Die Linien verlaufen alle in Richtung eines zentralen Punkts (das Atheniks-Data-Warehouse aus Feature 2)
- Kleine Partikel bewegen sich entlang der Linien (Datenfluss)
- Stil: Isometrisch oder flach, clean, nicht überladen
- Animation: Die Partikel fließen kontinuierlich, neue Verbindungen erscheinen sanft
- Alternative: Ein Steckbrett (Patch-Board) aus der Vogelperspektive, wo Kabel von verschiedenen Quellen in einen zentralen Hub führen

**Fallback:**
- SVG-Animation: Verbundene Knotenpunkte mit fließenden Partikeln

---

## FEATURE 6 — PLANUNG & FORECASTING

**Navigations-Label:** Planung & Forecasting

**Content-Bereich (Rechts):**

**Icon:** 🎯 (48px, blau #3b82f6)

**Titel (32px, fett, weiß):**
Planung & Forecasting

**Beschreibung (16px, normal, #cbd5e1, max-width 480px, line-height 1.7):**
Was-wäre-wenn-Szenarien in Minuten statt Wochen. Top-Down- und Bottom-Up-Planung, Szenario-Vergleiche, automatische Forecasts — alles auf Basis Ihrer echten Echtzeitdaten, nicht isolierter Excel-Dateien.

### VISUALISIERUNG FÜR PLANUNG & FORECASTING:

**Empfohlene Visual:** Vergleichs-Charts mit Szenario-Linien

**Beschreibung für Designer/Illustrator:**
- Ein großes, zentrales Linienchart (X-Achse: Monate, Y-Achse: abstrakt)
- Mehrere Linien überlagert:
  - Blaue Linie: "Tatsächlich" (durchgezogen, dick)
  - Grüne Linie: "Forecast optimistisch" (gestrichelt, leicht nach oben tendierend)
  - Orange/Rote Linie: "Forecast pessimistisch" (gestrichelt, leicht nach unten tendierend)
- Ein Schieberegler-Icon in der Mitte des Charts (verdeutlicht: Was-wäre-wenn)
- Kleine Pop-up-Blasen an den Linien mit Kennzahlen
- Stil: Clean, modern, mit leichtem Gradient im Chart-Hintergrund (dunkelblau zu transparent)
- Animation: Die Linien zeichnen sich beim Erscheinen auf, die Szenario-Linien erscheinen nacheinander
- Alternative: Ein Split-Screen mit zwei Versionen derselben Tabelle/Chart — links "vorher" (chaotisch, Excel-Style), rechts "nachher" (strukturiert, Atheniks-Style)

**Fallback:**
- SVG: Ein Chart mit 3 sich kreuzenden Linien, die verschiedene Szenarien darstellen

---

## ANIMATIONEN & INTERAKTION

### Wechsel zwischen Features:
1. Nutzer klickt auf Navigationspunkt links
2. **Aktiver Nav-Punkt** wechselt sofort (200ms, ease-out, Farbübergang)
3. **Content-Bereich rechts:**
   - Fade-out aktueller Content (150ms, opacity: 1→0)
   - Wechsel des Inhalts (synchron)
   - Fade-in neuer Content (300ms, opacity: 0→1)
   - Icon skaliert von 0.8 auf 1.0 (400ms, ease-out)
   - Text gleitet von unten nach oben (translateY: 20px→0, 400ms, staggered: Titel zuerst, dann Text, dann Visual)
4. **Progress-Indikatoren** (6 kleine Punkte unter dem Content): Aktiver Punkt ist blau gefüllt (#3b82f6), inaktive nur Rahmen (#94a3b8)

### Auto-Rotation (optional):
- Alle 6 Sekunden automatisch zum nächsten Feature wechseln
- Stoppt bei: Mouse-Hover über Section, Klick auf Navigation, Interaktion mit Content
- Startet wieder: 3 Sekunden nach Verlassen der Section

### Keyboard-Navigation:
- Pfeiltasten ↑/↓ wechseln zwischen Features
- Tab durch die Navigation
- Enter/Space aktiviert Feature

---

## RESPONSIVE ANPASSUNGEN

### Tablet (< 1024px):
- Navigation und Content untereinander statt nebeneinander
- Navigation wird horizontal (6 Tabs nebeneinander, scrollbar bei Bedarf)
- Content nimmt volle Breite ein
- Visualisierungen skalieren auf 80% der Breite

### Mobile (< 768px):
- Navigation: Horizontal swipeable Tabs (wie App-Tabs, iOS-Style)
- Content: Volle Breite, Padding reduziert auf 32px
- Visualisierungen: Skalieren auf 100% Breite, eventuell vereinfacht
- Auto-Rotation: Deaktiviert (Nutzer swiped selbst)
- Modal statt Content-Wechsel bei Detail-Ansicht

---

## CTA-BEREICH (UNTEN)

**Trust-Strip (14px, grau, zentriert):**
Made in Germany · GoBD-konform · DSGVO-konform
Abstand nach oben: 64px

**Buttons (zentriert, Abstand nach oben: 48px):**

**Primärer Button:**
[ Demo buchen ]
- Hintergrund: #3b82f6, Text: weiß 16px fett
- Padding: 16px 32px, Border-Radius: 8px
- Hover: #2563eb

**Sekundärer Button (Ghost):**
[ Produkte ansehen ]
- Hintergrund: transparent, Border: 1px solid #3b82f6
- Text: #3b82f6 16px fett
- Hover: Hintergrund #3b82f6, Text weiß

---

## TECHNISCHE HINWEISE

- **Framework:** React (empfohlen) mit useState für aktives Feature
- **Animation:** Framer Motion (empfohlen) oder CSS Transitions
- **Icons:** SVG-Icons (Lucide React oder Heroicons) — KEINE Emojis in Produktion
- **Visualisierungen:** SVG-Animationen oder Lottie-Files (leicht, skalierbar)
- **Accessibility:** ARIA-Tabs Pattern (role="tablist", role="tab", role="tabpanel"), Keyboard-Navigation, Focus-States sichtbar
- **Performance:** Visualisierungen lazy-loaded, CSS-Transitions statt JS-Animationen

---

## REFERENZEN

- **Stripe:** stripe.com/de/features (vertikale Feature-Navigation mit Content-Wechsel)
- **Linear:** linear.app/features (Feature Showcase mit sanften Übergängen)
- **Vercel:** vercel.com/features (elegante Tab-Wechsel)
- **Notion:** notion.so/product (Produkt-Sections mit Illustrationen)

---

## ZUSAMMENFASSUNG FÜR DEN ENTWICKLER/DESIGNER

Erstelle eine dunkle, moderne Plattform-Section mit einer vertikalen Navigation links (6 Features) und einem großen Content-Bereich rechts. Der Nutzer klickt sich durch die Features — nur ein Feature ist jeweils sichtbar. Jeder Feature hat ein stilisiertes Icon, einen Titel, eine Beschreibung und eine passende Visualisierung/Illustration (keine Stock-Fotos, stilisierte SVG/Animationen). Die Section soll professionell, tech-forward und vertrauenswürdig wirken — "Made in Germany" für den Mittelstand.

---

## OPTIONAL: VISUAL-STIL-LEITFADEN

Falls ein Illustration erstellt wird:
- **Stil:** Isometrisch oder flach, leicht 3D, clean und minimalistisch
- **Farben:** Primär dunkelblau (#0f172a), Akzente blau (#3b82f6), Highlights weiß
- **Keine realistischen Fotos:** Stilisierte Darstellungen, abstrakte Formen
- **Animation:** Subtil, nicht aufdringlich — sanfte Pulses, fließende Partikel, Fade-Ins
- **Kontrast:** Hoher Kontrast zwischen dunklem Hintergrund und leuchtenden Elementen
