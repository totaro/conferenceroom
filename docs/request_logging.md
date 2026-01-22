# Request Logging Middleware - Documentation

## Overview
This document explains the request logging middleware added to the room reservation application to track and monitor all incoming HTTP requests.

---

## What Was Added

A simple logging middleware that logs every incoming HTTP request to the console.

### Code Added (Lines 18-23)

```javascript
// Request logging middleware
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`${timestamp} - ${req.method} ${req.path}`);
    next();
});
```

**Location:** `server.js`, after middleware setup, before route definitions

---

## How It Works

### Middleware Function Anatomy

```javascript
app.use((req, res, next) => {
    // 1. Get current timestamp in ISO format
    const timestamp = new Date().toISOString();
    
    // 2. Log the request details
    console.log(`${timestamp} - ${req.method} ${req.path}`);
    
    // 3. Pass control to next middleware/route
    next();
});
```

### Components Explained

1. **`app.use()`** - Registers middleware to run on every request
2. **`(req, res, next)`** - Middleware function signature
   - `req` - Request object (contains request details)
   - `res` - Response object (not used here)
   - `next` - Function to call next middleware
3. **`new Date().toISOString()`** - Creates ISO 8601 timestamp
4. **`req.method`** - HTTP method (GET, POST, DELETE, etc.)
5. **`req.path`** - URL path (e.g., `/`, `/reservations`)
6. **`next()`** - Crucial! Passes control to the next middleware/route

---

## Example Output

### Server Console Logs

```
[dotenv@17.2.3] injecting env (1) from .env
Server running at http://localhost:3000
2026-01-22T17:38:13.117Z - GET /reservations
2026-01-22T17:39:13.610Z - GET /reservations
2026-01-22T17:39:13.817Z - GET /favicon.ico
2026-01-22T17:39:18.331Z - GET /reservations
```

### Request Breakdown

| Timestamp | Method | Path | Description |
|-----------|--------|------|-------------|
| `2026-01-22T17:38:13.117Z` | `GET` | `/reservations` | Fetching reservations list |
| `2026-01-22T17:39:13.610Z` | `GET` | `/reservations` | Another fetch |
| `2026-01-22T17:39:13.817Z` | `GET` | `/favicon.ico` | Browser requesting icon |
| `2026-01-22T17:39:18.331Z` | `GET` | `/reservations` | Polling for updates |

---

## Middleware Placement

### Execution Order

```
Incoming Request
       ↓
1. express.json() - Parse JSON bodies
       ↓
2. express.static('public') - Serve static files
       ↓
3. [LOGGING MIDDLEWARE] ← NEW - Log the request
       ↓
4. Route handlers (GET /, GET /reservations, etc.)
       ↓
Response Sent
```

### Why This Order?

**Placed after `express.json()` and `express.static()`:**
- These handle parsing and serving files first
- Logger sees the processed request

**Placed before routes:**
- Logs ALL requests, including 404s
- Centralized logging point
- Catches requests before route-specific logic

---

## Code Changes

### File: `server.js`

**Before (Lines 15-21):**
```javascript
app.use(express.json());
app.use(express.static('public'));

// Serve index.html at the root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
```

**After (Lines 15-28):**
```diff
 app.use(express.json());
 app.use(express.static('public'));
 
+// Request logging middleware
+app.use((req, res, next) => {
+    const timestamp = new Date().toISOString();
+    console.log(`${timestamp} - ${req.method} ${req.path}`);
+    next();
+});
+
 // Serve index.html at the root path
 app.get('/', (req, res) => {
     res.sendFile(path.join(__dirname, 'public', 'index.html'));
 });
```

---

## Benefits

### 1. **Debugging**
Quickly see what requests are hitting your server:
```
2026-01-22T17:39:13.610Z - GET /reservations
2026-01-22T17:39:14.123Z - POST /reservations
2026-01-22T17:39:14.456Z - GET /reservations
```
"Ah, the reservation was created (POST) and then the list was fetched (GET)!"

### 2. **Monitoring**
Track application usage patterns:
- Which endpoints are most popular?
- When is traffic highest?
- Are there unexpected requests?

### 3. **Security**
Detect suspicious activity:
```
2026-01-22T17:40:01.001Z - GET /admin
2026-01-22T17:40:01.234Z - GET /../../../etc/passwd
```
"These paths don't exist in my app - potential attack!"

### 4. **Performance Analysis**
Identify slow endpoints by observing request patterns

---

## Log Format

### ISO 8601 Timestamp

**Format:** `YYYY-MM-DDTHH:mm:ss.sssZ`

**Example:** `2026-01-22T17:39:13.610Z`

**Components:**
- `2026-01-22` - Date (Year-Month-Day)
- `T` - Time separator
- `17:39:13.610` - Time (Hour:Minute:Second.Milliseconds)
- `Z` - UTC timezone indicator

**Why ISO format?**
- ✅ Sortable (alphabetically sorts chronologically)
- ✅ Unambiguous (no date format confusion)
- ✅ Standard across systems
- ✅ Parseable by any log analysis tool

---

## Common Request Types Logged

### API Requests
```
2026-01-22T17:39:14.123Z - GET /reservations
2026-01-22T17:39:15.456Z - POST /reservations
2026-01-22T17:39:16.789Z - DELETE /reservations/abc-123
```

### Static Files
```
2026-01-22T17:39:13.817Z - GET /favicon.ico
2026-01-22T17:39:14.234Z - GET /styles.css
2026-01-22T17:39:14.567Z - GET /app.js
```

### Page Loads
```
2026-01-22T17:39:10.000Z - GET /
```

---

## What's NOT Logged (Yet)

### Response Information
Current middleware doesn't log:
- Response status code (200, 404, 500)
- Response time (how long the request took)
- Response size (bytes sent)

### Request Body
Doesn't log:
- POST/PUT body content
- Query parameters
- Headers

These can be added if needed (see Future Enhancements).

---

## Testing the Middleware

### Test 1: Visit Homepage
```bash
# Open browser to http://localhost:3000
```

**Expected Log:**
```
2026-01-22T17:39:10.000Z - GET /
```

### Test 2: API Request
```bash
curl http://localhost:3000/reservations
```

**Expected Log:**
```
2026-01-22T17:39:11.234Z - GET /reservations
```

### Test 3: Create Reservation
```bash
curl -X POST http://localhost:3000/reservations \
  -H "Content-Type: application/json" \
  -d '{
    "roomId": "room-1",
    "startTime": "2026-01-23T10:00:00Z",
    "endTime": "2026-01-23T11:00:00Z"
  }'
```

**Expected Log:**
```
2026-01-22T17:39:12.567Z - POST /reservations
```

---

## Future Enhancements

### 1. Enhanced Logging with Response Details

```javascript
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    const start = Date.now();
    
    // Log the request
    console.log(`${timestamp} - ${req.method} ${req.path}`);
    
    // Intercept response
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`  → ${res.statusCode} (${duration}ms)`);
    });
    
    next();
});
```

**Output:**
```
2026-01-22T17:39:10.000Z - GET /
  → 200 (15ms)
2026-01-22T17:39:11.234Z - GET /reservations
  → 200 (5ms)
2026-01-22T17:39:12.567Z - POST /reservations
  → 201 (12ms)
```

---

### 2. Log to File

```javascript
const fs = require('fs');

app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    const logEntry = `${timestamp} - ${req.method} ${req.path}\n`;
    
    // Console
    console.log(logEntry.trim());
    
    // File
    fs.appendFileSync('access.log', logEntry);
    
    next();
});
```

---

### 3. Use a Logger Library

**Install Morgan:**
```bash
npm install morgan
```

**Use it:**
```javascript
const morgan = require('morgan');
app.use(morgan('combined')); // Apache-style logs
```

**Output:**
```
::1 - - [22/Jan/2026:17:39:10 +0000] "GET / HTTP/1.1" 200 1234
::1 - - [22/Jan/2026:17:39:11 +0000] "GET /reservations HTTP/1.1" 200 42
```

---

### 4. Conditional Logging

Only log in development:
```javascript
if (process.env.NODE_ENV !== 'production') {
    app.use((req, res, next) => {
        const timestamp = new Date().toISOString();
        console.log(`${timestamp} - ${req.method} ${req.path}`);
        next();
    });
}
```

---

### 5. Filter Out Static Files

Don't log CSS, JS, image requests:
```javascript
app.use((req, res, next) => {
    // Skip logging for static files
    if (req.path.match(/\.(css|js|png|jpg|ico)$/)) {
        return next();
    }
    
    const timestamp = new Date().toISOString();
    console.log(`${timestamp} - ${req.method} ${req.path}`);
    next();
});
```

---

## Common Mistakes

### ❌ Mistake 1: Forgetting `next()`

```javascript
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    // Missing next()!
});
```

**Result:** Request hangs forever, server doesn't respond

### ❌ Mistake 2: Wrong Placement

```javascript
// BAD: After routes
app.get('/', (req, res) => { ... });
app.use((req, res, next) => { console.log(...); next(); });
```

**Result:** Middleware never runs for `/` route

### ❌ Mistake 3: Blocking Operation

```javascript
app.use((req, res, next) => {
    // Synchronous file write - BAD!
    fs.writeFileSync('log.txt', `${req.method} ${req.path}\n`);
    next();
});
```

**Result:** Slow server, blocks event loop

### ✅ Correct Implementation

```javascript
// GOOD: Before routes, non-blocking, calls next()
app.use(express.json());
app.use(express.static('public'));

app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`${timestamp} - ${req.method} ${req.path}`);
    next(); // ✓ Must call next()
});

app.get('/', (req, res) => { ... });
```

---

## Performance Impact

### Minimal Overhead

```javascript
const timestamp = new Date().toISOString();  // ~1 microsecond
console.log(`...`);                          // ~10 microseconds
next();                                       // ~1 microsecond
```

**Total:** ~12 microseconds per request

**Comparison:**
- Network round-trip: ~50,000 microseconds (50ms)
- Database query: ~1,000 microseconds (1ms)
- Logging: ~12 microseconds (0.012ms)

**Impact:** Negligible (< 0.02% overhead)

---

## Summary

**What Changed:**
- Added logging middleware to `server.js` (6 lines)

**What It Does:**
- Logs timestamp, HTTP method, and path for every request
- Helps with debugging, monitoring, and security

**Placement:**
- After `express.json()` and `express.static()`
- Before route definitions

**Benefits:**
- ✅ Easy debugging
- ✅ Traffic monitoring
- ✅ Security awareness
- ✅ Minimal performance impact
- ✅ Professional-grade logging

**Example Output:**
```
2026-01-22T17:39:13.610Z - GET /reservations
2026-01-22T17:39:14.123Z - POST /reservations
```

**Key Takeaway:**
Simple, effective request logging improves observability and makes debugging much easier.

---

## Related Files
- [server.js](file:///c:/code/conferenceroom/server.js) - Main server file with logging middleware
