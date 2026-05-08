# Atheniks Planer – Produktdokumentation

**Status:** Produkt-Definition v1.0  
**Letzte Aktualisierung:** März 2026  
**Produkt-Typ:** Self-Service SaaS

---

## 1. Produktüberblick

**Planer** ist eine cloud-basierte Finanzplanungs-Software für Unternehmen. Er ersetzt komplexe Excel-Tabellen durch eine intuitive, kollaborative Plattform für Budgetierung, Forecasting und Szenariomodellierung.

**Kernversprechen:**
> Strukturierte Finanzplanung ohne Excel-Chaos – gemeinsam, versionssicher und revisionssicher.

---

## 2. Problem & Lösung

### Das Problem (Status Quo)
- **Excel-Hell:** Controller arbeiten mit hunderten verknüpften Excel-Tabellen
- **Versionswirrwarr:** "Final_v3_Korrektur_Final.xlsx" – niemand weiß, welche Version gültig ist
- **Fehleranfällig:** Ein Tippfehler in einer Formel zerstört den gesamten Jahresplan
- **Keine Kollaboration:** Gleichzeitiges Arbeiten ist unmöglich, Dateien werden per E-Mail hin- und hergeschickt
- **Mangelnde Transparenz:** Nicht-Finanzexperten verstehen die Planungslogik nicht

### Die Lösung (Atheniks Planer)
- **Zentrale Wahrheitsquelle:** Alle Planungsdaten in einer Cloud-Datenbank
- **Echtzeit-Kollaboration:** Mehrere Nutzer arbeiten gleichzeitig am selben Plan
- **Versionskontrolle:** Automatische Historisierung, wer hat was wann geändert
- **Formelsicherheit:** Vordefinierte Logiken verhindern Fehler
- **Self-Service:** Business-User können ohne IT Budgets planen

---

## 3. Zielgruppe

### Primäre Zielgruppe
| Segment | Beschreibung |
|---------|--------------|
| **Controller** | Leiter der Finanzplanung, Reporting-Verantwortliche |
| **Finance Teams** | Mitarbeiter in Buchhaltung, Finanzen, FP&A |
| **Geschäftsführer** | CEOs/CFOs mittelständischer Unternehmen |

### Firmengrößen
- **Sweet Spot:** 50-500 Mitarbeiter
- Auch geeignet für: Startups mit Finanzierungsrunden (Series A+)
- Enterprise: Ja, für Tochtergesellschaften/Sparten

### Branchen
- Industrie & Fertigung
- Handel & E-Commerce  
- Dienstleistungen & Consulting
- Immobilien & Facility Management

---

## 4. Kernfeatures

### A. Budgetierung & Planung
- **Top-Down / Bottom-Up:** Konzern-Vorgaben vs. operative Planung
- **Break-Down:** Automatische Verteilung von Budgets auf Perioden/Kostenstellen
- **Zero-Based Budgeting:** Jedes Jahr bei Null beginnen
- **Rollierende Planung:** Flexible Planungshorizonte (6+6, 9+3, etc.)

### B. Szenarien & What-If
- **Versionsmanagement:** Best Case, Worst Case, Base Case parallel verwalten
- **Szenario-Vergleich:** Direkter Vergleich verschiedener Planungsstände
- **Was-Wäre-Wenn:** Sofortige Auswirkung von Parametervariationen
- **Copies & Snapshots:** Planungsstände sichern und wiederherstellen

### C. Kollaboration & Workflow
- **Freigabe-Workflows:** Genehmigungsprozess mit Benachrichtigungen
- **Kommentare:** Diskussionen direkt an Planungswerten
- **Audit Trail:** Vollständige Nachvollziehbarkeit aller Änderungen
- **Rechte & Rollen:** Wer darf wo planen?

### D. Integration & Datenimport (V1)
- **Excel-Import/Export:** Drag & Drop vorhandener Excel-Strukturen (primärer Datenaustausch)
- **CSV-Export/Import:** Standardisierte Datenübertragung
- **API:** REST-API verfügbar (Enterprise)

**Wichtig (V1):** Planer hat **keine direkten Anbindungen** an DATEV, SAP oder andere ERP-Systeme. Der Datenaustausch läuft ausschließlich über Datei-Upload/-Download (Excel/CSV). Direkte Systemintegrationen sind für spätere Versionen geplant.

### E. Reporting & Visualisierung
- **Dashboards:** Echtzeit-Übersichten über Planungsfortschritt
- **Kennzahlen:** Automatische Berechnung von KPIs (Umsatz, EBITDA, etc.)
- **Export:** PDF, Excel, PowerPoint-Export für Vorstands-Reports
- **Konsolidierung:** Automatische Zusammenführung mehrerer Plansätze

---

## 5. Ansichten (Views) in Planer

Planer bietet verschiedene Ansichten für unterschiedliche Planungsaufgaben und Perspektiven:

### A. Tabellenansicht (Grid View)
**Die klassische Excel-Erfahrung, aber besser.**
- Monatliche/Quartalsweise/Jährliche Spalten
- Zeilen: Konten, Kostenstellen, Produkte (konfigurierbar)
- Eingabe direkt in Zellen mit Validierung
- Farbcodierung und bedingte Formatierung
- Kommentare an einzelnen Zellen
- **Formeln:** Excel-ähnliche Syntax (=SUMME(A1:A12))

### B. Strukturansicht (Hierarchy View)
**Die Baumstruktur für komplexe Organisationen.**
- Drill-Down von Gesamtbudget auf Einzelpositionen
- Kollapsible Kategorien (Ein-/Ausklappen)
- Verantwortlichkeiten pro Knoten zuweisen
- Prozentuale Aufschlüsselung automatisch berechnet

### C. Diagrammansicht (Chart View)
**Visuelle Analyse und Präsentation.**
- Säulendiagramme: Budget vs. Ist vs. Forecast
- Liniencharts: Trends über Zeit
- Tortendiagramme: Kostenstruktur
- Wasserfalldiagramm: Abweichungsanalyse
- Vergleichsansicht: Szenario A vs. Szenario B

### D. Dashboard-Ansicht
**Der Überblick für Entscheider.**
- KPI-Kacheln (Umsatz, EBITDA, Cashflow, etc.)
- Ampel-Status (Grün/Gelb/Rot) pro Bereich
- Fortschrittsbalken: Planungsstatus pro Abteilung
- Aktivitätsfeed: Wer hat zuletzt was geändert?

### E. Szenario-Vergleich (Scenario Compare)
**Side-by-Side-Analyse verschiedener Planungsstände.**
- Split-Screen: Base Case vs. Best Case
- Delta-Anzeige: Absolute und prozentuale Abweichungen
- Heatmap: Wo sind die größten Unterschiede?

### F. Audit-Ansicht (History/Changelog)
**Nachvollziehbarkeit und Compliance.**
- Zeitstrahl: Alle Änderungen chronologisch
- Wer/Was/Wann pro Zelle
- Vorher/Nachher-Vergleich
- Wiederherstellen alter Stände

### G. Import-/Export-Ansicht
**Datenaustausch mit externen Systemen.**
- Upload-Vorschau vor dem Import
- Mapping: Excel-Spalten zu Planer-Feldern zuordnen
- Fehleranzeige: Ungültige Werte markieren
- Download aktueller Stand als Excel

---

## 6. Use Cases

### Use Case 1: Jahresbudget
**Situation:** Ein Controller muss das Budget für das nächste Jahr erstellen.

**Prozess mit Planer:**
1. Vorjahresdaten automatisch importieren (1 Klick)
2. Kostenträgerstruktur kopieren oder adjustieren
3. Budget-Vorgaben vom CFO verteilen (Top-Down)
4. Abteilungsleiter erhalten Zugriff, um ihre Budgets zu planen (Bottom-Up)
5. Automatische Konsolidierung aller Teilbudgets
6. Abweichungsanalyse: Ist vs. Soll vs. Vorjahr
7. Vorstandspräsentation mit integrierten Dashboards

**Ergebnis:** Budgetprozess von 6 Wochen auf 10 Tage reduziert.

---

### Use Case 2: Forecasting
**Situation:** Im laufenden Jahr zeigt sich, dass das Budget nicht mehr realistisch ist.

**Prozess mit Planer:**
1. Aktuellen Ist-Stand importieren (Excel-Export aus DATEV/ERP)
2. Restjahres-Prognose auf Basis aktueller Planung
3. Was-Wäre-Wenn-Analysen (Mehr Umsatz? Weniger Kosten?)
4. Neue Forecast-Version freigeben
5. Automatische Überleitung in das Reporting

**Ergebnis:** Wöchentliche Forecasts statt monatlicher, datenbasierte Entscheidungen.

*Hinweis: In V1 erfolgt der Import manuell per Excel/CSV. Automatische Systemanbindungen sind für spätere Versionen geplant.*

---

### Use Case 3: Szenarioplanung (Krise)
**Situation:** Unvorhergesehene Marktveränderungen erfordern schnelle Reaktion.

**Prozess mit Planer:**
1. Best Case / Worst Case Szenarien parallel anlegen
2. Schnelles Umrechnen bei geänderten Annahmen
3. Auswirkungen auf Liquidität sofort sichtbar
4. Vorstandsentscheidung dokumentieren

**Ergebnis:** Reaktionszeit von Wochen auf Stunden reduziert.

---

## 7. Technische Details

### Architektur
- **Cloud-Native:** 100% SaaS, keine On-Premise-Installation
- **Hosting:** Deutsche Cloud-Anbieter (DSGVO-konform)
- **Security:** ISO 27001, SOC 2 Typ II (in Planung)
- **Verfügbarkeit:** 99,5% Uptime-SLA

### Integrationen (V1)
| System | Status | Beschreibung |
|--------|--------|--------------|
| DATEV | ❌ Nicht verfügbar | Keine Anbindung in V1 (Später: Über Ledgera) |
| SAP | ❌ Nicht verfügbar | Keine Anbindung in V1 |
| MS Dynamics | ❌ Nicht verfügbar | Keine Anbindung in V1 |
| Excel | ✅ Verfügbar | Primärer Import/Export (XLSX, CSV) |
| Power BI | 🔜 Geplant | Native Connector (später) |

**Architektur-Prinzip:** Planer ist **kein ERP-Connector**. V1 unterstützt ausschließlich Datei-basierten Datenaustausch (Excel/CSV). Direkte Systemintegrationen sind für zukünftige Versionen vorgesehen.

### Datenmodell
- **Dimensions-basiert:** Kostenstellen, Kostenträger, Produkte, Regionen
- **Zeitreihen:** Monatlich, quartalsweise, jährlich
- **Währungen:** Multi-Currency Support mit automatischer Umrechnung

---

## 7. Preisgestaltung (Indikativ)

### Modell: Pro Nutzer / Monat

| Plan | Nutzer | Preis p.m. | Features |
|------|--------|------------|----------|
| **Starter** | bis 5 | €99 | Basis-Planung, 1 Integration |
| **Professional** | bis 20 | €299 | Alle Features, API-Zugriff |
| **Enterprise** | 20+ | Individuell | Custom Integrations, dediziertes Hosting |

### Zusätzliche Kosten
- **Setup:** Einmalig €500-2.000 (je nach Komplexität)
- **Training:** €150/Stunde
- **Support:** Inklusive (Professional), Premium Support verfügbar

---

## 8. Unterschied zum Wettbewerb

| Feature | Atheniks Planer | Excel | LucaNet | Anaplan |
|---------|----------------|-------|---------|---------|
| **Echtzeit-Kollaboration** | ✅ Ja | ❌ Nein | ⚠️ Limitiert | ✅ Ja |
| **Excel-Import** | ✅ Drag & Drop | ❌ N/A | ⚠️ Komplex | ⚠️ Komplex |
| **Preis** | 💶 Transparent | 🆓 Kostenlos | 💶💶 Enterprise | 💶💶💶 Enterprise |
| **Time-to-Value** | ⚡ Tage | ⚡ Sofort | 📅 Monate | 📅 Monate |
| **Self-Service** | ✅ Business-User | ⚠️ Experten | ⚠️ IT nötig | ❌ Berater nötig |

---

## 9. Roadmap (Indikativ)

### Q2 2026
- [ ] Mobile App (Read-Only)
- [ ] Erweiterte KPI-Bibliothek

### Q3 2026
- [ ] AI-basierte Prognosen
- [ ] Erweiterter DATEV-Connector (Mehr Mandanten)

### Q4 2026
- [ ] White-Label Option
- [ ] Erweiterte Workflow-Automatisierung

---

## 10. Ressourcen

### Verwandte Dokumente
- `ATHENIKS_PLANER_WEBSITE.md` – Website-Copy
- `ATHENIKS_CALCULUS_WEBSITE.md` – Begleitprodukt (Projektkalkulation)
- `ATHENIKS_INVESTA_WEBSITE.md` – Begleitprodukt (Investitionsrechnung)

### Ansprechpartner
- **Product Owner:** Maxim Neimeier
- **Technischer Lead:** Nikolai Sivtsev

---

*Diese Dokumentation ist ein lebendes Dokument und wird bei Produktänderungen aktualisiert.*
