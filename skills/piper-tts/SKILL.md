# Piper TTS Skill

## Beschreibung
Automatische deutsche Sprachnachrichten via Piper TTS.

## Trigger
- "Sprachnachricht: [TEXT]"
- "Morning Briefing"
- "Evening Briefing"

## Workflow

### Variante 1: Direkter Text
User: "Sprachnachricht: Guten Morgen Maxim"
→ Führe `/usr/local/bin/tts.sh "TEXT"` auf Host aus
→ Hole `/tmp/tts_output.wav`
→ Sende als Voice Message

### Variante 2: Briefing
User: "Morning Briefing"
→ Generiere Zusammenfassung aus Notion
→ Text an tts.sh
→ Audio senden

## Voraussetzungen
- Piper läuft auf Host (Port 10200)
- Script `/usr/local/bin/tts.sh` vorhanden
- WAV-Datei landet in `/tmp/tts_output.wav`

## Technisch
- Ausführung auf Host via docker exec
- Datei-Transfer vom Host zum Container
- Versand als Telegram Voice Message
