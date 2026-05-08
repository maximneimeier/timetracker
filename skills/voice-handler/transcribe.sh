#!/bin/bash
# Voice Handler - Transkriptions-Script
# Kopiert Audio zum VPS und transkribiert mit Whisper

VPS_IP="187.124.162.167"
SSH_KEY="/data/.ssh/openclaw_hostinger"
WHISPER_URL="http://localhost:9000"

# Parameter
AUDIO_FILE="$1"
LANGUAGE="${2:-de}"

if [ -z "$AUDIO_FILE" ]; then
    echo "Fehler: Keine Audio-Datei angegeben" >&2
    exit 1
fi

if [ ! -f "$AUDIO_FILE" ]; then
    echo "Fehler: Datei nicht gefunden: $AUDIO_FILE" >&2
    exit 1
fi

# Temporärer Dateiname auf VPS
TMP_FILENAME="voice_$(date +%s).ogg"

# Schritt 1: Datei zum VPS kopieren
scp -o StrictHostKeyChecking=no -i "$SSH_KEY" \
    "$AUDIO_FILE" "root@$VPS_IP:/tmp/$TMP_FILENAME" 2>/dev/null

if [ $? -ne 0 ]; then
    echo "Fehler: Konnte Datei nicht zum VPS kopieren" >&2
    exit 1
fi

# Schritt 2: Mit Whisper transkribieren
RESULT=$(ssh -o StrictHostKeyChecking=no -i "$SSH_KEY" "root@$VPS_IP" \
    "curl -s -X POST 'http://localhost:9000/asr?language=$LANGUAGE\u0026output=txt' \
    -H 'Content-Type: multipart/form-data' \
    -F 'audio_file=@/tmp/$TMP_FILENAME'" 2>/dev/null)

# Schritt 3: Aufräumen
ssh -o StrictHostKeyChecking=no -i "$SSH_KEY" "root@$VPS_IP" \
    "rm -f /tmp/$TMP_FILENAME" 2>/dev/null

# Ergebnis ausgeben
if [ -n "$RESULT" ]; then
    echo "$RESULT"
    exit 0
else
    echo "Fehler: Transkription fehlgeschlagen" >&2
    exit 1
fi
