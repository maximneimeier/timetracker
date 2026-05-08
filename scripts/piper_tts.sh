#!/bin/bash
# Piper TTS Wrapper für OpenClaw - Deutsche Sprachausgabe
# Nutzt den laufenden Piper Docker Container auf dem VPS

VPS_IP="187.124.162.167"
SSH_KEY="/data/.ssh/openclaw_hostinger"
PIPER_CONTAINER="piper"
VOICE_MODEL="/data/de_DE-thorsten-high.onnx"

# Funktion: Text zu Sprache umwandeln
piper_tts() {
    local text="$1"
    local output_file="${2:-/data/.openclaw/workspace/output_voice.wav}"
    
    # Escape Sonderzeichen für Shell
    local safe_text=$(echo "$text" | sed 's/"/\\"/g')
    
    # Generiere Audio im Container
    ssh -o StrictHostKeyChecking=no -o ConnectTimeout=10 \
        -i "$SSH_KEY" root@$VPS_IP \
        "docker exec $PIPER_CONTAINER sh -c 'echo \"$safe_text\" | .venv/bin/piper --model $VOICE_MODEL --output_file /data/output.wav'" 2>/dev/null
    
    if [ $? -ne 0 ]; then
        echo "Fehler: Piper TTS konnte nicht ausgeführt werden" >&2
        return 1
    fi
    
    # Kopiere Datei aus Container zum VPS /tmp
    ssh -o StrictHostKeyChecking=no -i "$SSH_KEY" root@$VPS_IP \
        "docker cp $PIPER_CONTAINER:/data/output.wav /tmp/output.wav" 2>/dev/null
    
    # Kopiere Datei vom VPS zum OpenClaw Workspace
    scp -o StrictHostKeyChecking=no -i "$SSH_KEY" \
        root@$VPS_IP:/tmp/output.wav "$output_file" 2>/dev/null
    
    if [ -f "$output_file" ]; then
        echo "$output_file"
        return 0
    else
        echo "Fehler: Ausgabedatei konnte nicht erstellt werden" >&2
        return 1
    fi
}

# Direkter Aufruf wenn Script ausgeführt wird
if [ $# -gt 0 ]; then
    piper_tts "$1" "$2"
fi
