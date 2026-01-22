# Environment Variables Setup - Walkthrough

## What We Implemented

This walkthrough documents the complete implementation of environment variable support using `dotenv` for the conference room reservation application.

---

## Changes Made

### 1. Installed dotenv Package

```bash
npm install dotenv
```

**Result:** Added `dotenv@17.2.3` to `package.json` dependencies

---

### 2. Updated server.js

#### Added dotenv Configuration (Lines 2-4)
```javascript
// Load environment variables from .env file
require('dotenv').config();
```

This **must** be at the very top of the file, before any other imports.

#### Updated Port Configuration (Lines 10-12)
```diff
-const port = 3000;
+// Use environment variable PORT if available, otherwise default to 3000
+// To set a custom port, create a .env file with: PORT=8080
+const port = process.env.PORT || 3000;
```

**How it works:**
- `process.env.PORT` - Reads the PORT environment variable
- `|| 3000` - Uses 3000 if PORT is not set (fallback)

---

### 3. Created Configuration Files

#### .env.example (Template)
```env
# Environment Variables Configuration

# Server Configuration  
PORT=3000

# Add other environment variables here as needed
```

**Purpose:** Template showing available configuration options (committed to git)

#### .env (Actual Configuration)
```env
# Environment Variables Configuration

# Server Configuration
PORT=3000
```

**Purpose:** Your local configuration (git-ignored, not committed)

---

## Demonstration

### Test 1: Default Port (3000)

**Configuration (.env):**
```env
PORT=3000
```

**Server Output:**
```
[dotenv@17.2.3] injecting env (1) from .env
Server running at http://localhost:3000
```

✅ Server runs on port 3000

---

### Test 2: Custom Port (8080)

**Updated .env:**
```env
PORT=8080
```

**Server Output:**
```
[dotenv@17.2.3] injecting env (1) from .env
Server running at http://localhost:8080
```

✅ Server runs on port 8080 - configuration change worked!

---

### Test 3: Back to Default (3000)

**Updated .env:**
```env
PORT=3000
```

**Server Output:**
```
[dotenv@17.2.3] injecting env (1) from .env
Server running at http://localhost:3000
```

✅ Server back on port 3000

---

## How dotenv Works

### Loading Flow

```
1. Application starts: node server.js
         ↓
2. First line executed: require('dotenv').config()
         ↓
3. dotenv loads .env file from project root
         ↓
4. Parses each line: PORT=3000
         ↓
5. Sets process.env.PORT = "3000"
         ↓
6. Code reads: const port = process.env.PORT || 3000
         ↓
7. Server starts on the configured port
```

### Visual Confirmation

The dotenv output confirms it's working:
```
[dotenv@17.2.3] injecting env (1) from .env
```

This shows:
- ✅ dotenv version (17.2.3)
- ✅ Number of variables loaded (1)
- ✅ Source file (.env)

---

## Key Learnings

### 1. Environment Variables Are Strings
```javascript
process.env.PORT // "3000" (string, not number)
```

Fortunately, Express handles the conversion automatically for ports.

### 2. Changes Require Server Restart
- Edit `.env` file
- **Must restart server** for changes to take effect
- Environment variables are loaded once at startup

### 3. .env File Location
- Must be in project root (same directory as `server.js`)
- Must be named exactly `.env` (not `env.txt` or `.env.txt`)

### 4. Git Security
- `.env` is in `.gitignore` - never committed
- `.env.example` is committed - shows template
- Keeps secrets safe from version control

---

## Benefits Demonstrated

### ✅ **Configuration Flexibility**
Changed port from 3000 → 8080 → 3000 without touching code

### ✅ **Environment-Specific Settings**
- Development: `PORT=3000`
- Testing: `PORT=3001`
- Staging: `PORT=4000`
- Production: Platform sets PORT automatically

### ✅ **Team Collaboration**
Each developer can have their own `.env` without conflicts

### ✅ **Production Ready**
Works seamlessly with:
- Heroku (auto-sets PORT)
- Railway (auto-sets PORT)
- AWS, Google Cloud, Azure (custom env vars)

---

## File Structure

```
conferenceroom/
├── .env                  ✅ Created (git-ignored)
├── .env.example          ✅ Created (template)
├── .gitignore            ✅ Already contains .env
├── server.js             ✅ Updated with dotenv
├── package.json          ✅ Updated with dotenv dependency
└── docs/
    └── environment_variables.md  ✅ Full documentation
```

---

## Quick Reference Commands

### Change Port
1. Edit `.env` file
2. Change `PORT=3000` to desired port
3. Restart server: `node server.js`

### Check Current Port
Look for this line in server output:
```
Server running at http://localhost:XXXX
```

### Reset to Default
Remove `.env` file or set `PORT=3000`

---

## Common Use Cases

### Use Case 1: Avoiding Port Conflicts
**Problem:** Port 3000 already in use by another app

**Solution:**
```env
PORT=3001
```

### Use Case 2: Team Development
**Developer A:** `PORT=3000`  
**Developer B:** `PORT=3001`  
**Developer C:** `PORT=8080`

No conflicts, everyone works independently

### Use Case 3: Multiple Environments
```env
# Development
PORT=3000

# Staging  
PORT=4000

# Production
# Set by hosting platform, or fallback to 3000
```

---

## Summary

**What Changed:**
1. Installed `dotenv` package
2. Added `require('dotenv').config()` to `server.js`
3. Changed port to `process.env.PORT || 3000`
4. Created `.env` and `.env.example` files
5. Demonstrated port changes (3000 → 8080 → 3000)

**Result:**
✅ Professional configuration management  
✅ Environment-specific settings  
✅ Production deployment ready  
✅ No hardcoded values  
✅ Team-friendly development

**Key Takeaway:**
Environment variables provide flexible, secure configuration that works across all environments from development to production.

---

## Related Documentation
- [environment_variables.md](file:///c:/code/conferenceroom/docs/environment_variables.md) - Full technical documentation
- [server.js](file:///c:/code/conferenceroom/server.js) - Updated server file
- [.env.example](file:///c:/code/conferenceroom/.env.example) - Configuration template
