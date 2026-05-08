#!/bin/bash
# Whisper ASR Wrapper für OpenClaw - Sprache zu Text
# Nutzt den laufenden Whisper Docker Container auf dem VPS

VPS_IP="187.124.162.167"
SSH_KEY="/data/.ssh/openclaw_hostinger"
WHISPER_PORT="9000"

# Funktion: Audio transkribieren
whisper_asr() {
    local audio_file="$1"
    local language="${2:-de}"
    
    if [ ! -f "$audio_file" ]; then
        echo "Fehler: Audio-Datei nicht gefunden: $audio_file" >&2
        return 1
    fi
    
    local filename=$(basename "$audio_file")
    local wav_filename="whisper_$$.wav"
    
    # Kopiere Original-Datei zum VPS
    scp -o StrictHostKeyChecking=no -i "$SSH_KEY" \
        "$audio_file" root@$VPS_IP:/tmp/$filename 2>/dev/null
    
    if [ $? -ne 0 ]; then
        echo "Fehler: Konnte Audio-Datei nicht zum VPS kopieren" >&2
        return 1
    fi
    
    # Konvertiere zu WAV auf dem VPS (bessere Kompatibilität)
    ssh -o StrictHostKeyChecking=no -i "$SSH_KEY" root@$VPS_IP \
        "ffmpeg -i /tmp/$filename -ar 16000 -ac 1 -c:a pcm_s16le /tmp/$wav_filename -y 2>/dev/null" 2>/dev/null
    
    # Transkribiere mit Whisper API
    local result=$(ssh -o StrictHostKeyChecking=no -o ConnectTimeout=120 \
        -i "$SSH_KEY" root@$VPS_IP \
        "curl -s -X POST 'http://localhost:$WHISPER_PORT/asr?language=${language}&output=txt' \
        -H 'Content-Type: multipart/form-data' \
        -F 'audio_file=@/tmp/$wav_filename'" 2>/dev/null)
    
    # Cleanup
    ssh -o StrictHostKeyChecking=no -i "$SSH_KEY" root@$VPS_IP \
        "rm -f /tmp/$filename /tmp/$wav_filename" 2>/dev/null
    
    echo "$result"
}

# Direkter Aufruf wenn Script ausgeführt wird
if [ $# -gt 0 ]; then
    whisper_asr "$1" "$2"
fi
