# Deploy Script für TimeTracker
# Usage: ./deploy.sh

set -e

echo "🚀 TimeTracker Deploy"
echo "====================="

# Prüfe ob .env existiert
if [ ! -f .env ]; then
    echo "❌ .env Datei nicht gefunden!"
    echo "Erstelle .env aus .env.local..."
    if [ -f .env.local ]; then
        cp .env.local .env
        echo "✅ .env erstellt"
    else
        echo "❌ Weder .env noch .env.local gefunden!"
        echo "Bitte erstelle .env mit:"
        echo "NEXT_PUBLIC_SUPABASE_URL=..."
        echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=..."
        exit 1
    fi
fi

# Lade .env
export $(grep -v '^#' .env | xargs)

# Git Pull
echo "📥 Pull latest changes..."
git pull origin main

# Build
echo "🔨 Building Docker image..."
docker-compose build --no-cache

# Stop & Start
echo "🔄 Restarting container..."
docker-compose down
docker-compose up -d

# Cleanup
echo "🧹 Cleaning up old images..."
docker image prune -f

echo ""
echo "✅ Deploy complete!"
echo "🌐 https://timetracker.atks-ops.de"
