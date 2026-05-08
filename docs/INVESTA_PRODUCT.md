# Investa – Produkt-Dokumentation

## Übersicht

**Investa** ist das Modul für Investitionsbewertung in Atheniks – ein projektbasiertes Tool zur Finanzmodellierung und Investitionsanalyse.

---

## Kern-Funktionen

### 1. Projektbasierte Modellierung
- Ein Projekt = ein Investitionsfall (z.B. Maschine, Akquisition, neues Produkt)
- Fester Workflow: Input → Tabellen → Analyse → Einstellungen

### 2. Vollständiges Finanzmodell
- **GuV** (Gewinn- und Verlustrechnung)
- **Cashflow** (operativ, investierend, finanzierend)
- **Bilanz**
- Monats- und Jahresansichten
- Konsistente Berechnungen über alle Aussagen hinweg

### 3. Investitionsbewertung (KPIs)
- **NPV** (Net Present Value)
- **IRR** (Internal Rate of Return)
- **ROI** (Return on Investment)
- **Payback** (Amortisationsdauer)
- **DCF** (Discounted Cash Flow)
- **WACC** / **Terminal Value**
- Unlevered, FCF-basiert

### 4. Finanzierung & Kapitalstruktur
- Eigenkapitalmodellierung
- Fremdkapital (Darlehen mit Tilgung, Zinsen)
- Auswirkungen auf Cashflow und Bilanz

### 5. Working Capital & CAPEX
- CAPEX-Planung und Abschreibung (linear/degressiv)
- Working-Capital-Annahmen
- Cash-Timing-Effekte

---

## Technischer Stack

| Komponente | Technologie |
|------------|-------------|
| Frontend | Next.js App Routes |
| Backend | Supabase |
| State Management | React Query |
| Berechnungen | Pure Functions in `src/lib/` |
| Styling | Tailwind CSS |

---

## URL-Routen

| Route | Zweck |
|-------|-------|
| `/projects/investa` | Liste aller Projekte |
| `/projects/investa/[id]/project` | Input: Annahmen (Umsatz, Kosten, CapEx, Finanzierung, Steuern, WC) |
| `/projects/investa/[id]/project/revenue` | Revenue-Seite pro Produkt |
| `/projects/investa/[id]/table` | Tabellen: GuV, Cashflow, Bilanz (jährlich/monatlich) |
| `/projects/investa/[id]/analysis` | Analyse: KPIs, Charts, Bewertung, Sensitivität |
| `/projects/investa/[id]/settings` | Einstellungen: Kategorien, Steuern, Laufzeit |
| `/[locale]/product/investa` | Marketing-Produktseite (öffentlich) |

---

## Workflow

```
Input (Annahmen)
    ↓
Tabellen (GuV, Cashflow, Bilanz)
    ↓
Analyse (KPIs, Charts)
    ↓
Einstellungen (Konfiguration)
```

---

## Berechnungspipeline

### 1. Monatliche Ebene
- Umsatz aus Produkten/Sales Volumes
- COGS (Cost of Goods Sold)
- OPEX (Operating Expenses)
- Personalkosten
- CapEx-Auszahlungen
- AfA (Abschreibungen linear/degressiv)
- Zinsen/Tilgung (Darlehen)
- Working-Capital-Änderungen
- Steuern

### 2. Jährliche Aggregation
- Aggregation von Monats- zu Jahresdaten
- GuV, Cashflow, Bilanz, FCF

### 3. KPIs
- NPV: Summe diskontierter FCF
- IRR: Newton-Raphson / Bisektion
- ROI: (Σ FCF − Initial Investment) / Initial Investment
- Payback: Undiskontierter kumulierter FCF bis ≥ 0

---

## Datenmodell (Supabase)

### Kern-Tabellen

| Tabelle | Zweck |
|---------|-------|
| `projects` | Projekt-Metadaten, project_type = 'investitionsrechnung' |
| `investment_project_data` | Investa-spezifische Daten (useful_life) |
| `drivers` | Treiber für variable Logik |
| `driver_values` | Monatswerte pro Treiber |
| `cost_items` | Kostenposten (fix/variabel/gemischt) |
| `cost_item_steps` | Stufen/Beträge pro Kostenposten |
| `capex_items` | Investitionen: Zahlung, AfA, Nutzungsdauer |
| `investment_project_loans` | Darlehen (Principal, Zins, Laufzeit, Tilgung) |
| `investment_project_equity_capital` | Eigenkapital / Beteiligungen |
| `products` | Produkte (Soft-Delete mit deleted_at) |
| `sales_volumes` | Absatzmengen-Konfiguration pro Produkt |
| `product_cost_components` | Produktkosten (COGS) pro Produkt |
| `personnel_costs` | Personalkosten (projektbezogen) |
| `operating_costs` | Sonstige OPEX (projektbezogen) |
| `cost_allocations` | Verteilung von Gemeinkosten |

---

## Zentrale Berechnungsfunktionen

| Datei | Funktion |
|-------|----------|
| `monthly-financial-calculations.ts` | Monatliche Finanzen |
| `yearly-financial-calculations.ts` | Jährliche Aggregation |
| `financial-metrics.ts` | NPV, IRR, ROI, Payback |
| `valuation-calculations.ts` | DCF, WACC, Terminal Value |
| `investment-calculations.ts` | Typen, Hilfen, AfA |
| `balance-sheet-calculations.ts` | Working Capital, Bilanz |
| `contribution-margin-calculations.ts` | Deckungsbeiträge |
| `investment-project-loan-calculations.ts` | Darlehens-Cashflows |

---

## Marketing-Positionierung

### Zielgruppe
- CFOs
- Finance Teams
- Controller
- Geschäftsführer (bei SMEs)

### Pain Points
- Excel-Modelle brechen, sind inkonsistent
- Investitionsbewertung dauert Tage
- Keine zentrale Wahrheit über Finanzdaten
- GuV/Cashflow/Bilanz in verschiedenen Tools

### Unique Mechanism
**"Ein Modell für alle Investment-Entscheidungen"**

- Input → Tabellen → Analyse → Einstellungen
- Konsistent über GuV, Cashflow, Bilanz
- Monatlich UND jährlich
- NPV, IRR, ROI, Payback aus demselben Modell

---

## Website-Sections (Hormozi/Stripe-Style)

1. **Hero**: "Ein Modell für alle Investment-Entscheidungen"
2. **Problem**: Excel-Frust / Fragmentierung / Zeitverlust
3. **Mechanismus**: Input → Berechnung → Analyse
4. **Features**: Integriertes Finanzmodell, Bewertung, Finanzierung, etc.
5. **CTA**: Demo anfragen / Early Access

---

## Erstellt

- **Datum**: 2026-03-12
- **Für**: Atheniks Website / Marketing
- **Autor**: Jarvis (mit Maxim)
