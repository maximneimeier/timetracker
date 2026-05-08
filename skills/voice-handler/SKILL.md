# Voice Handler Skill

## Beschreibung
Automatische Verarbeitung von Sprachnachrichten (Audio) aus Telegram. Empfängt Audio-Dateien, transkribiert sie mit Whisper ASR auf dem VPS und gibt den Text zurück.

## Trigger
- Empfang von Audio/Sprachnachrichten (MIME type: audio/ogg, audio/wav, audio/mp3)

## Workflow

### Schritt 1: Audio empfangen
- Audio-Datei wird von Telegram empfangen
- Datei wird lokal gespeichert unter `/data/.openclaw/media/inbound/`

### Schritt 2: Zum VPS kopieren
- SCP zum VPS: `root@187.124.162.167:/tmp/`
- SSH-Key: `~/.ssh/openclaw_hostinger`

### Schritt 3: Transkribieren mit Whisper
- Whisper-Container läuft auf VPS Port 9000
- API-Call: `POST http://localhost:9000/asr?language=de&output=txt`
- Antwort: Transkribierter Text

### Schritt 4: Text zurückgeben
- Transkription wird an den Agenten zurückgegeben
- Agent antwortet auf den Inhalt

## Technische Details

### Whisper API
```bash
curl -X POST 'http://localhost:9000/asr?language=de&output=txt' \
  -H 'Content-Type: multipart/form-data' \
  -F 'audio_file=@/tmp/audio.ogg'
```

### Unterstützte Formate
- OGG (Opus) - Telegram Standard
- WAV
- MP3
- M4A

### Sprachen
- Deutsch (de) - Standard
- Englisch (en)
- Spanisch (es)

## Voraussetzungen
- Whisper-Container läuft auf VPS Port 9000
- SSH-Zugang zum VPS konfiguriert
- Piper-TTS Skill für Antworten (optional)

## Dateien
- `SKILL.md` - Diese Dokumentation
- `transcribe.sh` - Transkriptions-Script
