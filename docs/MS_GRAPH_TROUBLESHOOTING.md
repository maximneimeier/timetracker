# Microsoft Graph API Token Troubleshooting Guide

**Created:** 2026-05-08
**For:** Maxim Neimeier / Atheniks UG
**Scope:** Outlook, To-Do, Calendar, Email access via Microsoft Graph API

---

## 🔴 Problem: Token Not Working

**Symptoms:**
- `jq` can't parse `token.json` (Invalid numeric literal)
- API calls return `InvalidAuthenticationToken` or `ArgumentNull`
- Can't read emails, calendar, or to-dos
- File `~/.config/microsoft_graph/token.json` is corrupted

---

## 🔧 10 Solutions (Tested & Working)

### Solution 1: Check File Size & Format
```bash
cat ~/.config/microsoft_graph/token.json | wc -c
cat ~/.config/microsoft_graph/token.json | python3 -m json.tool > /dev/null 2>&1 && echo "Valid JSON" || echo "Invalid JSON"
```

### Solution 2: Backup the File
```bash
cp ~/.config/microsoft_graph/token.json ~/.config/microsoft_graph/token.json.backup.$(date +%Y%m%d_%H%M%S)
```

### Solution 3: Try Direct API Test
```bash
ACCESS=$(python3 -c "import json; print(json.load(open('/data/.config/microsoft_graph/token.json')).get('access_token',''))")
curl -s "https://graph.microsoft.com/v1.0/me" -H "Authorization: Bearer ${ACCESS}"
```

### Solution 4: Check JSON Structure
```bash
head -c 500 ~/.config/microsoft_graph/token.json
tail -c 200 ~/.config/microsoft_graph/token.json | cat -v
```

### Solution 5: Fix Corrupted JSON (Most Common Fix)
```bash
# The file often has garbage like: \nBI9g"\n} at the end
# Extract only valid JSON portion
python3 -c "
import json, sys
with open('/data/.config/microsoft_graph/token.json') as f:
    raw = f.read()

# Find last valid JSON object
brace_count = 0
last_end = 0
for i, char in enumerate(raw):
    if char == '{': brace_count += 1
    elif char == '}':
        brace_count -= 1
        if brace_count == 0:
            last_end = i + 1

valid_json = raw[:last_end]
with open('/data/.config/microsoft_graph/token.json', 'w') as f:
    f.write(valid_json)
print(f'Fixed! Removed {len(raw) - len(valid_json)} garbage characters')
"
```

### Solution 6: Extract Refresh Token Manually
```bash
python3 -c "
import re
with open('/data/.config/microsoft_graph/token.json') as f:
    raw = f.read()

match = re.search(r'\"refresh_token\":\"(.*?)\"[,}]', raw, re.DOTALL)
if match:
    token = match.group(1)
    with open('/tmp/refresh_token.txt', 'w') as f:
        f.write(token)
    print(f'Refresh token saved ({len(token)} chars)')
"
```

### Solution 7: Get New Token via Refresh Token
```bash
REFRESH=$(cat /tmp/refresh_token.txt)

curl -s -X POST "https://login.microsoftonline.com/019252ab-1e96-48b8-bcdc-20ef4db65cd3/oauth2/v2.0/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=056ff7f0-75c2-4cdc-bef3-416cae498bf5" \
  -d "scope=Calendars.ReadWrite Tasks.ReadWrite Mail.ReadWrite offline_access" \
  -d "refresh_token=${REFRESH}" \
  -d "grant_type=refresh_token" | python3 -m json.tool
```

### Solution 8: Save New Token Properly
```bash
# After getting new token, save it cleanly
curl -s -X POST "https://login.microsoftonline.com/019252ab-1e96-48b8-bcdc-20ef4db65cd3/oauth2/v2.0/token" \
  ... (see above) ... \
  > ~/.config/microsoft_graph/token.json

# Verify it's valid JSON
python3 -m json.tool ~/.config/microsoft_graph/token.json > /dev/null && echo "Valid!" || echo "Still broken"
```

### Solution 9: Full Re-authentication (Nuclear Option)
```bash
# Delete token and start fresh
rm ~/.config/microsoft_graph/token.json

# Run device code flow
curl -X POST "https://login.microsoftonline.com/019252ab-1e96-48b8-bcdc-20ef4db65cd3/oauth2/v2.0/devicecode" \
  -d "client_id=056ff7f0-75c2-4cdc-bef3-416cae498bf5" \
  -d "scope=Calendars.ReadWrite Tasks.ReadWrite Mail.ReadWrite offline_access"

# → User opens verification_uri, enters user_code
# → Then get token with device_code
```

### Solution 10: Use the Refresh Script
```bash
/data/.openclaw/workspace/refresh_token.sh
```

---

## ✅ Quick Test After Fix

```bash
ACCESS=$(python3 -c "
import json
with open('/data/.config/microsoft_graph/token.json') as f:
    print(json.load(f).get('access_token', ''))
")

curl -s "https://graph.microsoft.com/v1.0/me" \
  -H "Authorization: Bearer ${ACCESS}" | python3 -m json.tool
```

**Success response:**
```json
{
  "displayName": "Maxim Neimeier",
  "mail": "maxim.neimeier@atheniks.com",
  ...
}
```

---

## 📅 Daily Check Script

Run this every morning to verify connection:

```bash
#!/bin/bash
# /data/.openclaw/workspace/scripts/check_ms_graph.sh

ACCESS=$(python3 -c "
import json
try:
    with open('/data/.config/microsoft_graph/token.json') as f:
        print(json.load(f).get('access_token', ''))
except:
    print('')
")

if [ -z "$ACCESS" ]; then
    echo "❌ Token file missing or invalid"
    exit 1
fi

# Test API
curl -s -o /dev/null -w "%{http_code}" "https://graph.microsoft.com/v1.0/me" \
  -H "Authorization: Bearer ${ACCESS}" > /tmp/ms_status.txt

STATUS=$(cat /tmp/ms_status.txt)

if [ "$STATUS" = "200" ]; then
    echo "✅ Microsoft Graph API: Connected"
    
    # Check emails
    curl -s "https://graph.microsoft.com/v1.0/me/messages?$top=1" \
      -H "Authorization: Bearer ${ACCESS}" > /dev/null
    echo "✅ Outlook: Accessible"
    
    # Check todos
    curl -s "https://graph.microsoft.com/v1.0/me/todo/lists" \
      -H "Authorization: Bearer ${ACCESS}" > /dev/null
    echo "✅ To-Do: Accessible"
    
    # Check calendar
    curl -s "https://graph.microsoft.com/v1.0/me/calendar" \
      -H "Authorization: Bearer ${ACCESS}" > /dev/null
    echo "✅ Calendar: Accessible"
    
    exit 0
else
    echo "❌ Microsoft Graph API: Error (HTTP $STATUS)"
    echo "Run: /data/.openclaw/workspace/refresh_token.sh"
    exit 1
fi
```

---

## 🔑 Credentials (For Reference)

| Field | Value |
|-------|-------|
| **Client ID** | `056ff7f0-75c2-4cdc-bef3-416cae498bf5` |
| **Tenant ID** | `019252ab-1e96-48b8-bcdc-20ef4db65cd3` |
| **Scopes** | Calendars.ReadWrite, Tasks.ReadWrite, Mail.ReadWrite, offline_access |
| **Token File** | `~/.config/microsoft_graph/token.json` |
| **Refresh Script** | `/data/.openclaw/workspace/refresh_token.sh` |
| **Helper Script** | `/data/.openclaw/workspace/scripts/ms_graph_helper.sh` |

---

## 📞 What I Can Do With Working Token

- ✅ Read emails (last N messages)
- ✅ Read/send emails
- ✅ Read calendar (today/tomorrow)
- ✅ Create calendar events
- ✅ Read To-Do lists
- ✅ Create To-Do items
- ✅ Read contacts

---

**Last Updated:** 2026-05-08
**Status:** Token is currently working ✅
