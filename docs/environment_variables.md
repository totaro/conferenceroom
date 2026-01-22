# Environment Variables Configuration - Documentation

## Overview
This document explains the environment variable support added to the room reservation application, allowing flexible configuration across different environments.

---

## What Was Changed

### 1. Installed dotenv Package
```bash
npm install dotenv
```

The `dotenv` package loads environment variables from a `.env` file into `process.env`.

### 2. Updated server.js

**Added at the top of the file (lines 2-4):**
```javascript
// Load environment variables from .env file
require('dotenv').config();
```

**Modified port configuration (lines 10-12):**
```javascript
// Use environment variable PORT if available, otherwise default to 3000
// To set a custom port, create a .env file with: PORT=8080
const port = process.env.PORT || 3000;
```

### 3. Created .env.example
A template file showing available environment variables:
```
# Environment Variables Configuration

# Server Configuration
PORT=3000

# Add other environment variables here as needed
```

### 4. Verified .gitignore
Confirmed `.env` is already in `.gitignore` to prevent committing sensitive data.

---

## How to Use

### Method 1: Using .env File (Recommended)

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit .env with your values:**
   ```
   PORT=8080
   ```

3. **Run the server:**
   ```bash
   node server.js
   ```
   Server will use port 8080

### Method 2: Command-Line Environment Variables

**Windows PowerShell:**
```powershell
$env:PORT=8080; node server.js
```

**Linux/Mac:**
```bash
PORT=8080 node server.js
```

### Method 3: Default (No Configuration)
If no PORT is set, the server defaults to 3000:
```bash
node server.js
# Runs on http://localhost:3000
```

---

## Benefits

### 1. Environment-Specific Configuration
```
Development:   PORT=3000
Staging:       PORT=4000
Production:    PORT=80 (set by hosting platform)
```

### 2. Security
- Sensitive values (API keys, database URLs) never committed to git
- `.env` is in `.gitignore`
- `.env.example` provides template without secrets

### 3. Cloud Deployment Ready
Works with hosting platforms like:
- **Heroku** - Sets PORT automatically
- **Railway** - Sets PORT automatically
- **AWS Elastic Beanstalk** - Custom environment variables
- **Google Cloud Run** - Sets PORT automatically
- **Azure App Service** - Custom application settings

### 4. Team Collaboration
- Each developer can have their own `.env` file
- No conflicts with teammates' settings
- Easy onboarding with `.env.example`

---

## Code Changes

### File: `server.js`

**Before:**
```javascript
const express = require('express');
const crypto = require('crypto');
const path = require('path');

const app = express();
const port = 3000;
```

**After:**
```diff
+// Load environment variables from .env file
+require('dotenv').config();
+
 const express = require('express');
 const crypto = require('crypto');
 const path = require('path');
 
 const app = express();
-const port = 3000;
+// Use environment variable PORT if available, otherwise default to 3000
+// To set a custom port, create a .env file with: PORT=8080
+const port = process.env.PORT || 3000;
```

---

## File Structure

```
conferenceroom/
├── .env.example          ← NEW: Template for environment variables
├── .env                  ← Create this (git-ignored)
├── .gitignore            ← Already contains .env
├── server.js             ← Updated to use dotenv
├── package.json          ← Updated with dotenv dependency
└── ...
```

---

## Environment Variables Reference

### Current Variables

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `PORT` | number | `3000` | Port the server listens on |

### Future Variables (Examples)

You can add more as your application grows:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database (when you add one)
DATABASE_URL=mongodb://localhost:27017/reservations
DATABASE_NAME=reservations

# Authentication (when you add it)
JWT_SECRET=your-secret-key
SESSION_SECRET=your-session-secret

# External Services
EMAIL_API_KEY=your-email-api-key
SMS_API_KEY=your-sms-api-key

# Feature Flags
ENABLE_LOGGING=true
ENABLE_RATE_LIMITING=false
```

---

## How dotenv Works

### Loading Process

1. Server starts: `node server.js`
2. First line executed: `require('dotenv').config()`
3. dotenv looks for `.env` in the current directory
4. Reads each line: `PORT=8080`
5. Sets `process.env.PORT = '8080'`
6. Your code reads: `process.env.PORT || 3000`

### Important Notes

- ⚠️ Environment variables are **strings**, not numbers
  ```javascript
  process.env.PORT // "8080" (string)
  parseInt(process.env.PORT) // 8080 (number)
  ```
- ⚠️ Express automatically handles the conversion for port
- ⚠️ `.env` file must be at the project root
- ⚠️ Changes to `.env` require server restart

---

## Best Practices

### 1. Never Commit .env
```gitignore
# .gitignore
.env
.env.local
.env.*.local
```

### 2. Always Provide .env.example
```env
# .env.example
PORT=3000
# DATABASE_URL=your-database-url-here
```

### 3. Use Meaningful Defaults
```javascript
const port = process.env.PORT || 3000; // ✅ Good
const apiKey = process.env.API_KEY; // ❌ No default - could be undefined
```

### 4. Document All Variables
Keep `.env.example` up to date with all required variables.

### 5. Validate Required Variables
```javascript
if (!process.env.DATABASE_URL) {
    console.error('ERROR: DATABASE_URL is required');
    process.exit(1);
}
```

---

## Troubleshooting

### Issue: .env file not loading

**Symptoms:**
- Server uses default values despite .env file existing
- `process.env.PORT` is undefined

**Solutions:**
1. Check file name is exactly `.env` (not `env.txt` or `.env.txt`)
2. Ensure `.env` is in the project root (same directory as `server.js`)
3. Verify `require('dotenv').config()` is at the **very top** of `server.js`
4. Check for syntax errors in `.env` file (no spaces around `=`)

### Issue: Port already in use

**Symptoms:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solutions:**
1. Stop other servers using port 3000
2. Change PORT in `.env` to a different number (e.g., 3001)
3. On Windows: `Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process`

### Issue: Changes not taking effect

**Solution:** Restart the server - `.env` is loaded once at startup

---

## Security Considerations

### What to Put in .env
✅ **YES** - Sensitive information:
- API keys
- Database passwords
- Secret tokens
- OAuth client secrets

❌ **NO** - Public information:
- Application name
- Public URLs
- Feature flags (unless sensitive)

### Production Deployment

**Do NOT use .env files in production.** Instead:

**Heroku:**
```bash
heroku config:set PORT=80
```

**Railway:**
Use the dashboard or CLI to set environment variables

**Docker:**
```bash
docker run -e PORT=8080 your-image
```

**Kubernetes:**
```yaml
env:
  - name: PORT
    value: "8080"
```

---

## Testing Different Configurations

### Test Default Port
```bash
node server.js
# Expected: Server running at http://localhost:3000
```

### Test Custom Port via .env
1. Create `.env`:
   ```
   PORT=8080
   ```
2. Run:
   ```bash
   node server.js
   # Expected: Server running at http://localhost:8080
   ```

### Test Environment Variable Override
```powershell
# Windows PowerShell
$env:PORT=9000; node server.js
# Expected: Server running at http://localhost:9000
# (Overrides .env file)
```

---

## Migration Guide

### For Existing Deployments

If you already have the application running:

1. **Local Development:**
   - Create `.env` file with `PORT=3000`
   - No changes needed

2. **Production:**
   - Set PORT environment variable on your hosting platform
   - Or rely on default (3000)
   - Platform-provided PORT will override default

### No Breaking Changes
- ✅ Default behavior unchanged (port 3000)
- ✅ Existing deployments continue working
- ✅ Backward compatible

---

## Summary

**What Changed:**
1. Installed `dotenv` package
2. Added `require('dotenv').config()` to `server.js`
3. Changed port from hardcoded `3000` to `process.env.PORT || 3000`
4. Created `.env.example` template
5. Verified `.env` in `.gitignore`

**Benefits:**
- ✅ Flexible configuration per environment
- ✅ Better security (no hardcoded secrets)
- ✅ Cloud deployment ready
- ✅ Team-friendly development
- ✅ Production best practices

**Result:**
Professional-grade configuration management following Node.js industry standards.

---

## Related Files
- [server.js](file:///c:/code/conferenceroom/server.js) - Main server file with dotenv configuration
- [.env.example](file:///c:/code/conferenceroom/.env.example) - Template for environment variables
- [.gitignore](file:///c:/code/conferenceroom/.gitignore) - Git ignore rules
- [package.json](file:///c:/code/conferenceroom/package.json) - Dependencies including dotenv
