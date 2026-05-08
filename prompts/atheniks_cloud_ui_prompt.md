# UI/UX Design Prompt: Atheniks Cloud

## Produktvision
Atheniks Cloud ist eine KI-gestützte Dokumenten-Intake- und Verarbeitungsplattform für deutsche KMU (5-150 Mitarbeiter). Der Kernwert: "Upload anything. Atheniks handles the rest."

## Zielgruppe
- Geschäftsführer von KMU
- Buchhaltungs-Mitarbeiter ohne technische Vorkenntnisse
- Steuerberater (als sekundärer Kanal)

## Design-Philosophie: "Zero-Effort"
- Keine Schulung nötig
- Sofort verständlich
- Visuelles Feedback bei jedem Schritt
- Mobile-first Denken (auch Desktop muss mobil-ähnlich einfach sein)

## Haupt-Screens

### 1. UPLOAD-HUB (Landing Page nach Login)
**Zentrales Element:** Großer, auffälliger Upload-Bereich (Dropzone)
- Drag & Drop Zone mit animiertem Upload-Icon
- Unterstützte Formate visuell dargestellt: PDF, JPG, PNG, CSV, XML, E-Mail
- Kamera-Scan-Option für mobile Nutzung
- "Hochladen"-Button prominent
- Recent Uploads als kleine Vorschau-Kacheln darunter
- Statistik-Leiste: "Diesen Monat: 45 Dokumente verarbeitet | 3h Zeit gespart"

**Sidebar:**
- Ordner-Struktur (KI-generiert): "Eingangsrechnungen", "Ausgangsrechnungen", "Kontoauszüge", "Verträge", "Steuerdokumente"
- Automatisch erkannt, aber editierbar
- Suchleiste oben mit Voice-Input-Icon
- Filter: "Heute", "Diese Woche", "Unkategorisiert", "Fehler"

### 2. DOKUMENTEN-VORSCHAU (nach Upload)
**Split-Screen:**
- Links: Original-Dokument als Vorschau
- Rechts: KI-extrahierte Daten in editierbaren Feldern
  - Betrag (mit Währungserkennung)
  - Datum
  - Verkäufer/Empfänger
  - IBAN (auto-erkannt)
  - USt-Id
  - Kategorie (Dropdown mit Vorschlag)
- "Übernehmen" Button grün
- "Fehler melden" Button dezent
- Fortschrittsbalken: "Verarbeitet... → Kategorisiert → Bereit für DATEV"

### 3. AI-QUERY-INTERFACE (Natürliche Sprache)
**Chat-ähnliches Interface:**
- Eingabefeld unten mit Platzhalter: "Frag mich: 'Wie viel Umsatz hatten wir im März?' oder 'Zeige alle Rechnungen von Müller GmbH'"
- Konversation-Verlauf als Chat-Blasen
- Antworten mit visuellen Elementen:
  - Tabellen bei Daten
  - Charts bei Vergleichen
  - Dokument-Thumbnails bei Anfragen nach spezifischen Belegen
- Voice-Input-Button
- Schnell-Fragen als Chips über dem Eingabefeld

### 4. BANK-MATCHING-OBERFLÄCHE
**Tabellen-Ansicht:**
- Links: Banktransaktionen (importiert via PSD2)
- Rechts: Zugeordnete Dokumente
- Drag & Drop zum Zuordnen
- "Auto-Match" Button mit KI-Vorschlägen (grün hinterlegt bei hoher Konfidenz)
- Unmatched Items markiert in Orange
- Bilanz-Anzeige oben: "Kontostand: €XX | Offene Posten: €YY"

### 5. DATEV-EXPORT-SEITE
**Ein-Klick-Export:**
- Große grüne "Nach DATEV exportieren"-Schaltfläche
- Kalender-Auswahl für Zeitraum
- Vorschau der exportierten Buchungssätze als Tabelle
- Status-Anzeige: "Export bereit", "Übertragung läuft...", "Abgeschlossen ✓"
- Historie der letzten Exporte

## Farbpalette
- Primär: Atheniks-Blau (#2563EB) für Actions
- Sekundär: Soft-Grün (#10B981) für Success-States
- Warnung: Sanftes Orange (#F59E0B) für Review-needed
- Hintergrund: Sehr helles Grau (#F9FAFB) für Cards auf Weiß
- Text: Dunkelgrau (#1F2937), nie rein Schwarz

## Typografie
- Headlines: Inter oder SF Pro, semibold
- Body: Inter, regular, 16px Mindestgröße
- Monospace (für Beträge): JetBrains Mono

## Animationen & Feedback
- Upload-Fortschritt als flüssige Animation
- Dokumente "fliegen" visuell in die richtige Ordner-Kategorie
- Toast-Benachrichtigungen statt Pop-ups
- Haptic Feedback für mobile Nutzer

## Barrierefreiheit
- WCAG 2.1 AA konform
- Alle Icons mit Text-Labels
- Screenreader-optimiert
- Kontrastverhältnis mindestens 4.5:1

## Responsive Breakpoints
- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px+
- Desktop-XL: 1920px+ (mehr Spalten, größere Vorschauen)

---

ZUSÄTZLICHE ANWEISUNG FÜR DIE KI:
Erstelle ein modernes, aufgeräumtes Interface ohne überladene Elemente. Denke an Apple's Design-Sprache kombiniert mit deutscher Effizienz. Jeder Screen muss einem 55-jährigen Buchhalter sofort verständlich sein, ohne Erklärung.
