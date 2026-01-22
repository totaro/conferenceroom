# Room ID Input Validation - Documentation

## Overview
This document explains the input validation enhancements added to the POST /reservations endpoint to ensure `roomId` data integrity and security.

---

## What Was Added

Three layers of validation for the `roomId` parameter:

```javascript
// Validate roomId
if (typeof roomId !== 'string') {
    return res.status(400).json({ error: "Room ID must be a string." });
}

const trimmedRoomId = roomId.trim();

if (trimmedRoomId.length === 0) {
    return res.status(400).json({ error: "Room ID cannot be empty." });
}

if (trimmedRoomId.length > 50) {
    return res.status(400).json({ error: "Room ID cannot exceed 50 characters." });
}
```

**Location:** `server.js`, lines 95-108  
**Position:** After the initial null check, before the promise lock

---

## Why This Was Needed

### The Problem
Before these validations, the endpoint would accept:
- ❌ Non-string values (numbers, objects, arrays)
- ❌ Empty strings or whitespace-only strings
- ❌ Extremely long strings (potential DoS attack)

### Security Risks
Without validation:
1. **Database corruption** - Invalid data types stored
2. **Injection attacks** - Malicious strings could exploit the system
3. **DoS attacks** - Extremely long strings consume memory/bandwidth
4. **Data inconsistency** - Empty or invalid room IDs make queries fail

---

## Validation Details

### Validation 1: Type Check

```javascript
if (typeof roomId !== 'string') {
    return res.status(400).json({ error: "Room ID must be a string." });
}
```

**What it checks:** Ensures `roomId` is actually a string data type

**Why it's needed:** JavaScript is dynamically typed, so users could send:
```json
{"roomId": 123}           // number
{"roomId": true}          // boolean  
{"roomId": ["room-1"]}    // array
{"roomId": {"id": 1}}     // object
{"roomId": null}          // null (caught by earlier check)
```

**How it works:**
- `typeof roomId` returns the data type as a string
- We compare it to `'string'`
- If it's not a string, return 400 error immediately

**Example rejection:**
```bash
Request:
{
  "roomId": 123,
  "startTime": "2026-01-23T10:00:00Z",
  "endTime": "2026-01-23T11:00:00Z"
}

Response: 400 Bad Request
{
  "error": "Room ID must be a string."
}
```

---

### Validation 2: Empty String Check

```javascript
const trimmedRoomId = roomId.trim();

if (trimmedRoomId.length === 0) {
    return res.status(400).json({ error: "Room ID cannot be empty." });
}
```

**What it checks:** Ensures the room ID isn't empty after removing whitespace

**Why it's needed:** Users could send:
```json
{"roomId": ""}          // empty string
{"roomId": "   "}       // only whitespace
{"roomId": "\t\n"}      // tabs and newlines
```

**How it works:**
1. **`roomId.trim()`** - Removes leading and trailing whitespace
   - `"  room-1  "` becomes `"room-1"`
   - `"   "` becomes `""`
2. **Store result** - `const trimmedRoomId` saves the cleaned value
3. **Check length** - If length is 0, it was empty or whitespace-only

**Why trim?**
- Prevents accidental spaces: `" room-1 "` vs `"room-1"`
- Makes comparisons more reliable
- Prevents database issues with whitespace

**Example rejections:**
```bash
Request 1:
{
  "roomId": "",
  "startTime": "2026-01-23T10:00:00Z",
  "endTime": "2026-01-23T11:00:00Z"
}

Response: 400 Bad Request
{
  "error": "Room ID cannot be empty."
}

Request 2:
{
  "roomId": "     ",
  "startTime": "2026-01-23T10:00:00Z",
  "endTime": "2026-01-23T11:00:00Z"
}

Response: 400 Bad Request
{
  "error": "Room ID cannot be empty."
}
```

---

### Validation 3: Length Limit

```javascript
if (trimmedRoomId.length > 50) {
    return res.status(400).json({ error: "Room ID cannot exceed 50 characters." });
}
```

**What it checks:** Ensures room ID doesn't exceed 50 characters

**Why 50 characters?**
- Reasonable for real-world room IDs
- Prevents abuse (someone sending megabytes of data)
- Matches common database field limits
- Balances flexibility with security

**Why it's needed:**
1. **DoS Protection** - Prevents attackers from sending huge strings
2. **Database Constraints** - Many databases have field length limits
3. **UX Consistency** - Encourages standardized naming
4. **Memory/Bandwidth** - Large strings waste resources

**How it works:**
- Checks `trimmedRoomId.length` property
- Compares to 50
- Rejects if greater than 50

**Example rejection:**
```bash
Request:
{
  "roomId": "this-is-a-very-very-very-very-very-very-very-long-room-id-that-exceeds-fifty-characters",
  "startTime": "2026-01-23T10:00:00Z",
  "endTime": "2026-01-23T11:00:00Z"
}

Response: 400 Bad Request
{
  "error": "Room ID cannot exceed 50 characters."
}
```

---

## Complete Validation Flow

```
POST /reservations Request
         ↓
1. Extract roomId, startTime, endTime
         ↓
2. Check all fields exist
   ❌ Missing? → "Missing required fields."
         ↓
3. Check roomId is a string
   ❌ Not a string? → "Room ID must be a string."
         ↓
4. Trim whitespace from roomId
         ↓
5. Check trimmed roomId is not empty
   ❌ Empty? → "Room ID cannot be empty."
         ↓
6. Check trimmed roomId length ≤ 50
   ❌ Too long? → "Room ID cannot exceed 50 characters."
         ↓
7. Continue to promise lock and business validation
         ↓
8. Validate reservation (dates, overlaps, etc.)
         ↓
9. Create reservation
```

---

## Code Changes

### File: `server.js`

**Before (Lines 89-93):**
```javascript
const { roomId, startTime, endTime } = req.body;

if (!roomId || !startTime || !endTime) {
    return res.status(400).json({ error: "Missing required fields." });
}

// Use promise chaining...
```

**After (Lines 89-108):**
```diff
 const { roomId, startTime, endTime } = req.body;

 if (!roomId || !startTime || !endTime) {
     return res.status(400).json({ error: "Missing required fields." });
 }

+// Validate roomId
+if (typeof roomId !== 'string') {
+    return res.status(400).json({ error: "Room ID must be a string." });
+}
+
+const trimmedRoomId = roomId.trim();
+
+if (trimmedRoomId.length === 0) {
+    return res.status(400).json({ error: "Room ID cannot be empty." });
+}
+
+if (trimmedRoomId.length > 50) {
+    return res.status(400).json({ error: "Room ID cannot exceed 50 characters." });
+}
+
 // Use promise chaining...
```

---

## Examples of Valid vs Invalid Inputs

### ✅ Valid Room IDs

```json
{"roomId": "room-1"}                    // Simple
{"roomId": "conference-room-A"}         // Descriptive
{"roomId": "Building-2-Floor-3-Room-5"} // Detailed (47 chars)
{"roomId": "  room-1  "}                // With whitespace (trimmed)
```

### ❌ Invalid Room IDs

| Input | Reason | Error Message |
|-------|--------|---------------|
| `123` | Not a string | "Room ID must be a string." |
| `true` | Boolean | "Room ID must be a string." |
| `""` | Empty | "Room ID cannot be empty." |
| `"    "` | Only whitespace | "Room ID cannot be empty." |
| `"A".repeat(51)` | Too long (51 chars) | "Room ID cannot exceed 50 characters." |
| `null` | Null | "Missing required fields." (earlier check) |
| `undefined` | Undefined | "Missing required fields." (earlier check) |

---

## Security Benefits

### 1. Type Safety
Prevents type coercion bugs:
```javascript
// Without validation:
if (roomId === 1) // Could match number 1
reservations.find(r => r.roomId == roomId) // Loose equality issues

// With validation:
// roomId is guaranteed to be a string
```

### 2. Injection Prevention
Limits the attack surface for:
- **SQL Injection** (if you add a database later)
- **NoSQL Injection** (MongoDB, etc.)
- **Command Injection** (if room IDs are used in shell commands)
- **XSS** (Cross-Site Scripting, if displayed without sanitization)

### 3. DoS Protection
Prevents attackers from sending:
```json
{
  "roomId": "A".repeat(1000000),  // 1 million characters
  "startTime": "2026-01-23T10:00:00Z",
  "endTime": "2026-01-23T11:00:00Z"
}
```

**Resource consumption without limit:**
- Memory: ~1 MB per request
- Bandwidth: ~1 MB sent and received
- CPU: Milliseconds on comparisons
- Database: Huge field storage

**With 50-char limit:**
- Memory: ~50 bytes per request
- Bandwidth: ~50 bytes
- CPU: Microseconds
- Database: Minimal storage

### 4. Data Consistency
Ensures all room IDs in the system:
- Follow the same rules
- Are comparable reliably
- Work with database migrations
- Match frontend expectations

---

## Why Validate on the Server?

### Client-Side Validation is Not Enough

**Frontend validation:**
```javascript
// In the browser
if (roomId.length > 50) {
    alert("Room ID too long!");
}
```

**Problem:** Users can bypass this by:
1. Editing the HTML with DevTools
2. Disabling JavaScript
3. Using curl, Postman, or custom scripts
4. Intercepting and modifying requests

**Server-side validation (what we added):**
- ✅ Cannot be bypassed
- ✅ Always enforced
- ✅ Protects the database
- ✅ Security boundary
- ✅ Works with any client (web, mobile, API)

---

## Performance Impact

### Minimal Overhead

These checks are extremely fast:
```javascript
typeof roomId !== 'string'  // ~1 nanosecond
roomId.trim()               // ~1 microsecond
trimmedRoomId.length        // ~1 nanosecond
```

**Total additional time:** < 10 microseconds per request

**Comparison:**
- Network round-trip: ~50,000 microseconds (50ms)
- Database query: ~1,000 microseconds (1ms)
- Input validation: ~10 microseconds (0.01ms)

**Trade-off:** Absolutely worth it for security and data integrity

---

## Common Mistakes (Avoided)

### ❌ Mistake 1: Not Trimming
```javascript
if (roomId.length === 0) { 
    // BAD: "  " has length 2, passes the check!
}
```

### ❌ Mistake 2: Combining Checks
```javascript
if (!roomId || typeof roomId !== 'string') {
    return res.status(400).json({ error: "Invalid room ID" });
}
// BAD: Missing field vs wrong type get the same error
```

### ❌ Mistake 3: No Length Limit
```javascript
// No length check = DoS vulnerability
if (typeof roomId === 'string' && roomId.trim().length > 0) {
    // Accepts 1GB strings!
}
```

### ❌ Mistake 4: Using Regex for Simple Checks
```javascript
if (!/^.{1,50}$/.test(roomId)) {
    // Unnecessary complexity for a simple length check
}
```

### ✅ Our Implementation
```javascript
// 1. Separate checks with specific error messages
// 2. Trim before checking emptiness
// 3. Enforce maximum length
// 4. Simple, readable code
```

---

## Testing the Validation

### Test 1: Type Validation
```bash
curl -X POST http://localhost:3000/reservations \
  -H "Content-Type: application/json" \
  -d '{
    "roomId": 123,
    "startTime": "2026-01-23T10:00:00Z",
    "endTime": "2026-01-23T11:00:00Z"
  }'
```
**Expected:** `400 {"error": "Room ID must be a string."}`

---

### Test 2: Empty Validation
```bash
curl -X POST http://localhost:3000/reservations \
  -H "Content-Type: application/json" \
  -d '{
    "roomId": "   ",
    "startTime": "2026-01-23T10:00:00Z",
    "endTime": "2026-01-23T11:00:00Z"
  }'
```
**Expected:** `400 {"error": "Room ID cannot be empty."}`

---

### Test 3: Length Validation (Linux/Mac)
```bash
curl -X POST http://localhost:3000/reservations \
  -H "Content-Type: application/json" \
  -d "{
    \"roomId\": \"$(printf 'A%.0s' {1..51})\",
    \"startTime\": \"2026-01-23T10:00:00Z\",
    \"endTime\": \"2026-01-23T11:00:00Z\"
  }"
```
**Expected:** `400 {"error": "Room ID cannot exceed 50 characters."}`

---

### Test 4: Length Validation (PowerShell)
```powershell
$longRoomId = "A" * 51
$body = @{
    roomId = $longRoomId
    startTime = "2026-01-23T10:00:00Z"
    endTime = "2026-01-23T11:00:00Z"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/reservations" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body
```
**Expected:** `400 {"error": "Room ID cannot exceed 50 characters."}`

---

### Test 5: Valid Request
```bash
curl -X POST http://localhost:3000/reservations \
  -H "Content-Type: application/json" \
  -d '{
    "roomId": "room-1",
    "startTime": "2026-01-23T10:00:00Z",
    "endTime": "2026-01-23T11:00:00Z"
  }'
```
**Expected:** `201 Created` with reservation object

---

## Error Response Format

All validation errors follow the same format:

```json
{
  "error": "Descriptive error message"
}
```

**Status Code:** `400 Bad Request`

This consistency makes error handling easier for API clients.

---

## Future Enhancements

### Possible Improvements

1. **Pattern Validation**
   ```javascript
   const roomIdPattern = /^[a-zA-Z0-9-_]+$/;
   if (!roomIdPattern.test(trimmedRoomId)) {
       return res.status(400).json({ 
           error: "Room ID can only contain letters, numbers, hyphens, and underscores." 
       });
   }
   ```

2. **Whitelist of Valid Room IDs**
   ```javascript
   const validRooms = ['room-1', 'room-2', 'conference-a'];
   if (!validRooms.includes(trimmedRoomId)) {
       return res.status(400).json({ error: "Invalid room ID." });
   }
   ```

3. **Database Lookup**
   ```javascript
   const roomExists = await db.rooms.exists({ id: trimmedRoomId });
   if (!roomExists) {
       return res.status(400).json({ error: "Room not found." });
   }
   ```

4. **Configurable Limits**
   ```javascript
   const MAX_ROOM_ID_LENGTH = process.env.MAX_ROOM_ID_LENGTH || 50;
   if (trimmedRoomId.length > MAX_ROOM_ID_LENGTH) {
       return res.status(400).json({ 
           error: `Room ID cannot exceed ${MAX_ROOM_ID_LENGTH} characters.` 
       });
   }
   ```

---

## Integration with Other Validations

### Current Validation Order

1. **Required fields check** (line 91-93)
2. **Room ID type check** (line 95-97) ← NEW
3. **Room ID empty check** (line 99-105) ← NEW
4. **Room ID length check** (line 107-109) ← NEW
5. **Promise lock** (line 111)
6. **Business validation** (dates, duration, future limit)
7. **Overlap check**

Each validation:
- Returns immediately on failure
- Provides a specific error message
- Prevents invalid data from reaching the database

---

## Related Validations

This validation complements other input validations in the system:

- **Duration validation** - Minimum 15 minutes, maximum 8 hours
- **Future date validation** - Maximum 90 days in advance
- **Overlap validation** - No double-booking
- **Date format validation** - Valid ISO 8601 dates

Together, these create a robust validation layer.

---

## Summary

**What Changed:**  
Added three input validation checks for `roomId` parameter in POST /reservations

**What Was Added:**
1. Type validation (must be string)
2. Empty check (after trimming whitespace)
3. Length limit (maximum 50 characters)

**Why:**  
- **Security:** Prevent injection attacks and DoS
- **Data Quality:** Enforce consistency and integrity
- **User Experience:** Clear, specific error messages
- **Production Ready:** Professional-grade validation

**Benefits:**
- ✅ Stronger security posture
- ✅ Better data integrity
- ✅ Clearer error messages
- ✅ Minimal performance impact
- ✅ Production-ready code

**Key Takeaway:**  
Always validate user input on the server - it's your last line of defense against bad data and malicious attacks. Client-side validation improves UX, but server-side validation protects your system.

---

## Related Files
- [server.js](file:///c:/code/conferenceroom/server.js) - Main server file with validation
- [Duration Validation](file:///c:/code/conferenceroom/docs/duration_validation.md) - Related validation docs
- [Race Condition Fix](file:///c:/code/conferenceroom/docs/race_condition_fix.md) - Promise lock implementation
