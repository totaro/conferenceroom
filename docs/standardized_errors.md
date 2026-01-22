# Standardized Error Handling - Documentation

## Overview
This document explains the improvements made to `server.js` to ensure consistent, reliable error handling across the entire API.

---

## 2 Key Changes

### 1. Consistent JSON Error Responses
**Goal:** Ensure every error returns a predictable JSON structure so the frontend can display it correctly.

**Before:**
Sometimes errors might have been plain text, HTML, or inconsistent JSON properties.

**After:**
All errors strictly follow this format:
```json
{
  "error": "Human readable error message"
}
```

**Implementation in POST /reservations:**
In the promise chain, we now pass errors to `next(err)` instead of potentially sending a second response or crashing.
```javascript
.catch(err => {
    console.error('Error processing reservation:', err);
    // Pass error to the global error handler
    next(err);
});
```

---

### 2. Global 500 Error Handler
**Goal:** Catch any unhandled exceptions (crashes, bugs) and prevent the server from hanging without a response.

**Added Middleware:**
At the end of `server.js`, we added:
```javascript
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err);
    
    if (res.headersSent) {
        return next(err);
    }

    res.status(500).json({
        error: "Internal Server Error",
        // Only show detailed error in development for security
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});
```

---

## Benefits

### ✅ Reliability
- Server won't hang if a bug occurs.
- Always returns a valid JSON response (status 500).

### ✅ Security
- Hides stack traces and sensitive error details from users in production.
- Only exposes "Internal Server Error" to the public.

### ✅ Consistency
- Frontend code (`app.js`) can always rely on `response.json().error` to display messages in the toast notification system.

---

## Related Files
- [server.js](file:///c:/code/conferenceroom/server.js) - Updated server code.
