# YouTube Transcriber Skill

## Beschreibung
Extrahiert automatisch Untertitel von YouTube-Videos und fasst den Inhalt zusammen.

## Anwendung
Wenn du einen YouTube-Link schickst:
1. Extrahiert Auto-Untertitel (wenn verfügbar)
2. Konvertiert zu lesbarem Text
3. Fasst den Inhalt zusammen

## Voraussetzungen
- yt-dlp muss auf dem Host installiert sein
- Ausführung über Subagent auf dem Host

## Workflow

### Input
- YouTube URL (z.B. https://www.youtube.com/watch?v=...)

### Ausführung
```bash
yt-dlp --write-auto-sub --skip-download --sub-format ttml --convert-subs srt -o /tmp/%(id)s "URL"
```

### Output
- Zusammenfassung der Videoinhalte
- Wichtige Stichpunkte
- Ggf. Timestamps

## Datenschutz
- Untertitel werden temporär gespeichert (/tmp)
- Keine dauerhafte Speicherung
- Nur öffentlich verfügbare Videos
