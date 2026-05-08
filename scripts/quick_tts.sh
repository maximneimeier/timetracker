#!/bin/bash
# Schneller Wrapper für Piper TTS - Einfache Sprachnachrichten
# Nutzung: ./quick_tts.sh "Dein Text hier"

SCRIPT_DIR="/data/.openclaw/workspace/scripts"
OUTPUT_FILE="/data/.openclaw/workspace/voice_message.wav"

if [ $# -eq 0 ]; then
    echo "Nutzung: $0 \"Dein Text hier\""
    exit 1
fi

"$SCRIPT_DIR/piper_tts.sh" "$1" "$OUTPUT_FILE"

if [ $? -eq 0 ]; then
    echo "$OUTPUT_FILE"
else
    echo "Fehler beim Erstellen der Sprachnachricht" >&2
    exit 1
fi
