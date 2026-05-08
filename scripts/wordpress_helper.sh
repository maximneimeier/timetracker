#!/bin/bash
# WordPress REST API Helper
# Credentials werden aus Umgebungsvariablen oder direkt hier geladen

WP_URL="${WP_URL:-https://cms.atheniks.com}"
WP_USER="${WP_USER:-admin_atheniks}"
WP_PASS="${WP_PASS:-lsc6 zu1d GU7V jB1e 8lJ7 XkWd}"

# HTTP Basic Auth Base64 encoding
AUTH=$(echo -n "${WP_USER}:${WP_PASS}" | base64)

# Hilfsfunktion für API-Calls
wp_api_call() {
    local method="$1"
    local endpoint="$2"
    local data="${3:-}"
    
    local url="${WP_URL}/wp-json/${endpoint}"
    
    if [ -n "$data" ]; then
        curl -s -X "$method" "$url" \
            -H "Authorization: Basic ${AUTH}" \
            -H "Content-Type: application/json" \
            -d "$data"
    else
        curl -s -X "$method" "$url" \
            -H "Authorization: Basic ${AUTH}"
    fi
}

# Hauptfunktion
main() {
    local action=$1
    shift
    
    case $action in
        "list-posts")
            wp_api_call "GET" "wp/v2/posts?per_page=10"
            ;;
        "get-post")
            local post_id=$1
            wp_api_call "GET" "wp/v2/posts/${post_id}"
            ;;
        "create-post")
            local title="$1"
            local content="$2"
            local status="${3:-draft}"
            wp_api_call "POST" "wp/v2/posts" "{
                \"title\": \"$title\",
                \"content\": \"$content\",
                \"status\": \"$status\"
            }"
            ;;
        "update-post")
            local post_id=$1
            local title="$2"
            local content="$3"
            wp_api_call "POST" "wp/v2/posts/${post_id}" "{
                \"title\": \"$title\",
                \"content\": \"$content\"
            }"
            ;;
        "list-pages")
            wp_api_call "GET" "wp/v2/pages?per_page=10"
            ;;
        "list-media")
            wp_api_call "GET" "wp/v2/media?per_page=10"
            ;;
        "info")
            wp_api_call "GET" "wp/v2"
            ;;
        *)
            echo "WordPress REST API Helper für Atheniks"
            echo ""
            echo "Verwendung: $0 {action} [params]"
            echo ""
            echo "Aktionen:"
            echo "  list-posts                 - Zeigt die letzten 10 Posts"
            echo "  get-post [id]              - Zeigt einen bestimmten Post"
            echo "  create-post 'Titel' 'Content' [status]  - Erstellt neuen Post (status: draft/publish)"
            echo "  update-post [id] 'Titel' 'Content'        - Aktualisiert einen Post"
            echo "  list-pages                 - Zeigt alle Seiten"
            echo "  list-media                 - Zeigt Medien"
            echo "  info                       - Zeigt API-Info"
            echo ""
            echo "Beispiele:"
            echo "  $0 list-posts"
            echo "  $0 create-post 'Neuer Blogpost' '<p>Inhalt hier...</p>' draft"
            ;;
    esac
}

main "$@"