# Prompt: Atheniks Plattform Section — Landing Page Design

## Aufgabe

Erstelle eine **interactive Plattform-Section** für die Atheniks Website (atheniks.com). Diese Section soll die 6 Kernkomponenten der Atheniks Plattform als klickbare Kacheln darstellen. Der Nutzer soll auf jede Kachel klicken können, um mehr zu erfahren.

---

## Section-Überschrift

**Hauptüberschrift (groß, fett, weiß):**
DIE ATHENIKS PLATTFORM

**Subheadline (mittel, grau):**
Daten verbinden. KI nutzen. Entscheidungen treffen.

---

## Die 6 Kacheln (gleich groß, nebeneinander)

Jede Kachel hat: Icon (oben) + Titel (fett) + Kurzbeschreibung (1 Zeile) + Hover-Effekt + Klick öffnet Modal

### Kachel 1 — Plattform
- **Icon**: 🏗️ (Layers/Stack-Symbol)
- **Titel**: Plattform
- **Kurzbeschreibung**: Übergeordnetes System
- **Modal-Text bei Klick**: Atheniks ist keine isolierte Software, sondern eine integrierte Plattform. Alle Module greifen auf dieselbe Datenbasis zu — ohne Silos, ohne Duplikate, ohne Integrationschaos. Ein Ecosystem, das mit Ihrem Unternehmen wächst.

### Kachel 2 — Data Warehouse
- **Icon**: 🗄️ (Database-Symbol)
- **Titel**: Data Warehouse
- **Kurzbeschreibung**: Zentrale Datenablage
- **Modal-Text bei Klick**: Ihr Single Source of Truth. Alle Unternehmensdaten — aus ERP, CRM, Excel, Banken — strukturiert und versioniert an einem Ort. GoBD-konform, audit-sicher und jederzeit abrufbar. Das Fundament für alle Analysen.

### Kachel 3 — KI Engine
- **Icon**: 🧠 (Brain/Spark-Symbol)
- **Titel**: KI Engine
- **Kurzbeschreibung**: Natürlichsprachliche Analyse
- **Modal-Text bei Klick**: Fragen Sie Ihre Daten auf Deutsch: "Wie entwickelt sich unser Cash-Flow bei 20 Prozent mehr Personal?" Die KI Engine interpretiert, analysiert und liefert Antworten in Sekunden — ohne SQL, ohne Excel, ohne Data-Science-Team.

### Kachel 4 — Finanzanalyse
- **Icon**: 📊 (Chart/Analytics-Symbol)
- **Titel**: Finanzanalyse
- **Kurzbeschreibung**: Kennzahlen & Insights
- **Modal-Text bei Klick**: Von Budgetplanung über ROI-Analyse bis zum Asset-Portfolio: Alle Finanzkennzahlen in Echtzeit. Dashboards, die sofort zeigen, wo Sie stehen — und Forecasts, die zeigen, wohin Sie gehen können.

### Kachel 5 — Datenintegration
- **Icon**: 🔗 (Connection/Plug-Symbol)
- **Titel**: Datenintegration
- **Kurzbeschreibung**: Alle Quellen verbinden
- **Modal-Text bei Klick**: SAP, DATEV, Salesforce, Excel, Bank-APIs — Atheniks integriert alle Ihre Datenquellen automatisch. ETL-Pipelines, die im Hintergrund laufen, ohne manuelle Imports oder veraltete CSV-Exports.

### Kachel 6 — Planung & Forecasting
- **Icon**: 🎯 (Target/Trend-Symbol)
- **Titel**: Planung & Forecasting
- **Kurzbeschreibung**: Zukunft modellieren
- **Modal-Text bei Klick**: Was-wäre-wenn-Szenarien in Minuten statt Wochen. Top-Down- und Bottom-Up-Planung, Szenario-Vergleiche, automatische Forecasts — alles auf Basis Ihrer echten Echtzeitdaten, nicht isolierter Excel-Dateien.

---

## Design-Vorgaben

### Farbpalette
| Element | Hex-Code |
|---------|----------|
| Section-Hintergrund | #0f172a (dunkelblau) |
| Kachel-Hintergrund | #1e293b (etwas heller) |
| Überschrift-Text | #ffffff (weiß) |
| Subheadline-Text | #94a3b8 (grau) |
| Kachel-Titel | #ffffff (weiß) |
| Kachel-Kurzbeschreibung | #94a3b8 (grau) |
| Akzentfarbe (Icons, Hover) | #3b82f6 (blau) |
| Hover-Glow | rgba(59, 130, 246, 0.3) |

### Layout
- **Desktop**: 6 Kacheln in einer horizontalen Reihe, gleichmäßig verteilt
- **Tablet**: 3 Kacheln pro Reihe (2 Reihen)
- **Mobile**: 2 Kacheln pro Reihe (3 Reihen)
- **Abstand zwischen Kacheln**: 24px
- **Kachel-Padding**: 32px
- **Kachel-Border-Radius**: 16px
- **Section-Padding**: 120px oben/unten

### Typografie
- **Hauptüberschrift**: 48px, fett (font-weight: 700), weiß, zentriert
- **Subheadline**: 20px, normal (font-weight: 400), grau, zentriert, Abstand nach unten: 64px
- **Kachel-Icon**: 48px, blau (#3b82f6)
- **Kachel-Titel**: 18px, fett (font-weight: 600), weiß, Abstand nach oben: 16px
- **Kachel-Kurzbeschreibung**: 14px, normal, grau, Abstand nach oben: 8px
- **Modal-Text**: 16px, normal, weiß, max. Breite: 480px, line-height: 1.6

### Animationen & Interaktionen

**Hover-Effekt (Desktop):**
- Kachel hebt sich um 4px an: `transform: translateY(-4px)`
- Schatten wird blau: `box-shadow: 0 20px 40px rgba(59, 130, 246, 0.2)`
- Übergang: `transition: all 0.3s ease-out`
- Icon skaliert leicht: `transform: scale(1.1)`
- Cursor: `pointer`

**Klick-Verhalten:**
- Öffnet ein **zentrales Modal** (nicht Accordion, damit es auf Mobile gut aussieht)
- Modal-Hintergrund: `rgba(0, 0, 0, 0.8)` mit Blur-Effekt
- Modal-Inhalt: Dunkle Karte (#1e293b), 16px Border-Radius, 48px Padding
- Modal erscheint mit Fade-In + Scale-Up: `opacity: 0→1, transform: scale(0.95)→scale(1)`, Dauer: 300ms
- Schließen via X-Button oben rechts, Klick auf Hintergrund, oder ESC-Taste

**Scroll-Animation:**
- Section fade-in beim Scrollen: `opacity: 0→1, translateY: 30px→0`, Dauer: 600ms, Delay zwischen Kacheln: 100ms (staggered)

---

## Trust-Strip (unter den Kacheln)

Text, zentriert, 14px, grau:
Made in Germany · GoBD-konform · DSGVO-konform

Abstand nach oben: 64px

---

## CTA-Bereich (unter dem Trust-Strip)

Zwei Buttons, zentriert, Abstand nach oben: 48px:

**Primärer Button (blau, fett):**
[ Demo buchen ]
- Hintergrund: #3b82f6
- Text: weiß, 16px, fett
- Padding: 16px 32px
- Border-Radius: 8px
- Hover: Hintergrund dunkler (#2563eb)

**Sekundärer Button (Ghost):**
[ Produkte ansehen ]
- Hintergrund: transparent
- Border: 1px solid #3b82f6
- Text: #3b82f6, 16px, fett
- Padding: 16px 32px
- Border-Radius: 8px
- Hover: Hintergrund #3b82f6, Text weiß

---

## Responsive Anpassungen

**Tablet (768px–1024px):**
- Kacheln: 3 pro Reihe
- Überschrift: 36px
- Subheadline: 18px

**Mobile (<768px):**
- Kacheln: 2 pro Reihe
- Überschrift: 28px
- Subheadline: 16px
- Section-Padding: 80px oben/unten
- Modal: Volle Breite, von unten hereinschieben (Bottom Sheet)

---

## Technische Hinweise

- Framework: React (empfohlen) oder Vue/Svelte
- CSS: Tailwind CSS oder vanilla CSS mit CSS Grid
- Icons: Lucide React oder Heroicons (keine Emojis in Produktion, SVG-Icons verwenden)
- Accessibility: ARIA-Labels für Kacheln, Keyboard-Navigation (Tab durch Kacheln, Enter/Space zum Öffnen, ESC zum Schließen), Focus-States sichtbar
- Performance: Lazy-Loading für Modals, CSS-Transitions statt JavaScript-Animationen

---

## Referenzen

- **Stil-Richtung**: Notion.com (clean, modern), Linear.app (dark mode, smooth animations), Databricks.com (Plattform-Sections)
- **Tonfall**: Professionell, innovativ, vertrauenswürdig. Kein Hype, keine Buzzwords. Deutsche Engineering-Qualität.
- **Sprache**: Deutsch (Deutschland)

---

## Zusammenfassung für den Designer/Entwickler

Erstelle eine dunkle, moderne Plattform-Section mit 6 interaktiven Kacheln. Jede Kachel repräsentiert eine Kernkomponente der Atheniks-Datenplattform. Beim Hover heben sich die Kacheln an und leuchten blau. Beim Klick öffnet sich ein Modal mit einer detaillierten Erklärung. Die Section soll professionell, tech-forward und vertrauenswürdig wirken — "Made in Germany" für den Mittelstand.
