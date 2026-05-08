# UI/UX Design Prompt: Formular Software

## Produktvision
Eine Formular-Plattform für externe Datenerfassung. Nutzer erstellt ein Formular, sendet einen Link an Empfänger, diese füllen das Formular aus und laden Dateien hoch – alles wird automatisch in einer strukturierten Datenbank gespeichert.

**Kernwert:** "Daten sammeln ohne Chaos. Keine E-Mail-Anhänge mehr."

## Zielgruppe
- HR-Manager (Bewerbungen, onboarding)
- Sales-Teams (Kunden-Dokumente, Verträge)
- Buchhaltung (Belege von externen Dienstleistern)
- Rechtsabteilungen (Vertragsunterlagen)
- Event-Organisatoren (Anmeldungen + Dokumente)

## Design-Philosophie: "Runde Reise"
1. Formular erstellen (Sender)
2. Link teilen (Sender)
3. Ausfüllen + Upload (Empfänger)
4. Daten organisiert vorfinden (Sender)

Jeder Schritt muss klar getrennt und visuell verständlich sein.

## Haupt-Screens

### 1. DASHBOARD (Sender-Startseite)
**Übersicht:**
- Header: "Willkommen, [Name]" + CTA "Neues Formular erstellen" (großer blauer Button)
- Letzte Formulare als Kacheln:
  - Formular-Titel
  - Status-Indikator (Aktiv/Paused/Abgeschlossen)
  - Anzahl Antworten (z.B. "12 Antworten")
  - Fortschrittsbalken bei laufenden Formularen
  - 3-Dot-Menü für Aktionen (Bearbeiten, Kopieren, Löschen)

**Statistik-Leiste:**
- "Diese Woche: 45 Antworten | 3 Formulare aktiv"
- Quick-Filter: "Alle", "Aktiv", "Archiviert"

**Sidebar:**
- Ordner/Projekte (z.B. "Q1-Bewerbungen", "Kunden-Onboarding 2026")
- Templates-Galerie (Vorlagen: Bewerbung, Kunden-Doku, Feedback, etc.)

---

### 2. FORMULAR-BUILDER (Editor)
**Drei-Spalten-Layout:**
- **Links:** Komponenten-Palette
  - Textfeld (kurz)
  - Textfeld (lang)
  - Dropdown
  - Radio Buttons
  - Checkboxen
  - Datei-Upload (mit Drag-Drop-Zone)
  - Datumsauswahl
  - Unterschrift (digital)
  - Abschnitts-Trenner

- **Mitte:** Live-Vorschau des Formulars
  - Drag & Drop zum Sortieren
  - Jedes Feld klickbar für Einstellungen
  - Vorschau-Modus: "So sieht es für Empfänger aus"

- **Rechts:** Feld-Einstellungen (kontextabhängig)
  - Label (Pflichtfeld-Toggle)
  - Platzhalter-Text
  - Hilfstext
  - Validierungsregeln (z.B. "Muss E-Mail enthalten")
  - Bedingte Logik ("Nur anzeigen wenn...")

**Top-Bar:**
- Formular-Titel (editierbar)
- Speichern-Status ("Alle Änderungen gespeichert")
- Vorschau-Button
- Veröffentlichen-Button (primär)

---

### 3. EMPFÄNGER-ANSICHT (Public Form)
**Mobile-optimiert, clean:**
- Logo des Senders oben (optional)
- Formular-Titel als H1
- Fortschrittsbalken bei mehrseitigen Formularen
- Abschnitte klar getrennt mit Zwischenüberschriften
- Datei-Upload-Feld:
  - Drag-Drop-Zone
  - "Oder klicken zum Auswählen"
  - Mehrere Dateien erlaubt
  - Fortschrittsanzeige beim Upload
  - Thumbnails für Bilder, Icons für Dokumente
- "Absenden"-Button prominent unten
- Erfolgs-Nachricht nach Absenden mit Option "Weitere Antwort"

**Optional:**
- Zeitlimit-Anzeige (falls gesetzt)
- Speichern & Fortsetzen später (mit Link)
- Fortschrittsspeicherung

---

### 4. ANTWORTEN-ÜBERSICHT (Sender)
**Tabellen-Ansicht:**
- Spalten: Name/E-Mail, Eingangsdatum, Status (Vollständig/Unvollständig), Aktionen
- Filter: Zeitraum, Vollständigkeit, Bestimmte Felder
- Bulk-Actions: "Als CSV exportieren", "Löschen", "Archivieren"
- Suche über alle Felder

**Detail-Ansicht pro Antwort:**
- Alle Felder schön formatiert
- Hochgeladene Dateien als Gallery
- Download-Button (einzeln oder alle als ZIP)
- Weiterleiten per E-Mail
- Notizen-Feld

**Visualisierungen:**
- Charts für Multiple-Choice-Antworten
- Word-Cloud für Freitext
- Timeline der Eingänge

---

### 5. TEILEN & EINBINDEN
**Modal/Seite nach Veröffentlichen:**
- Link kopieren (prominent)
- QR-Code generieren
- E-Mail direkt versenden (Eingabefeld für Empfänger)
- Embed-Code für Website
- Ablaufdatum setzen
- Antworten-Limit setzen
- Passwortschutz (optional)

---

## Farbpalette
- Primär: Frisches Blau (#3B82F6) für Actions
- Sekundär: Warmes Grün (#22C55E) für Success
- Hintergrund: Sehr helles Grau (#F8FAFC)
- Karten: Weiß (#FFFFFF) mit subtilem Schatten
- Text: Neutral-900 (#111827)
- Fehler: Rot-500 (#EF4444)

## Typografie
- System-Font-Stack (Inter, -apple-system, BlinkMacSystemFont)
- Headlines: 24-32px, semibold
- Body: 16px, regular
- Kleingedrucktes: 14px, gray-500

## Interaktions-Muster
- Hover-Effekte auf allen klickbaren Elementen
- Smooth-Scrolling
- "Shake"-Animation bei Validierungsfehlern
- Toast-Benachrichtigungen für Feedback
- Auto-Save-Indikator

## Besondere Features
- **Magic-Link:** Empfänger kann angefangene Formulare später fortsetzen
- **Smart-Duplicate-Erkennung:** Warnung bei potenziellen Doppeleinträgen
- **Live-Kollaboration:** Mehrere Sender bearbeiten gleichzeitig
- **White-Label:** Eigene Domain, eigenes Logo, eigene Farben

## Mobile-Optimierung
- Touch-Targets mindestens 44x44px
- Native Datei-Auswahl über OS
- Kamera-Upload direkt aus dem Formular
- Swipe-Gesten in der Übersicht

---

ZUSÄTZLICHE ANWEISUNG FÜR DIE KI:
Das Interface soll sich anfühlen wie eine Mischung aus Typeform (für die Eleganz) und Google Forms (für die Einfachheit), aber mit professionellerem Look. Wichtig: Der Unterschied zu herkömmlichen Formular-Tools ist der nahtlose Datei-Upload – das muss visuell hervorgehoben werden.
