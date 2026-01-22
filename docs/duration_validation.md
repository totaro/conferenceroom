# Duration and Future Date Validation - Documentation

## Overview
This document explains the validation enhancements added to the room reservation system to prevent unrealistic reservation durations and future booking dates.

---

## Why These Validations Matter

Without these checks, users could create **unrealistic** or **abusive** reservations:
- ❌ Book a room for 30 seconds (too short)
- ❌ Book a room for 3 days straight (too long)
- ❌ Book a room for the year 2050 (too far in the future)

These validations ensure **practical** and **reasonable** use of the reservation system.

---

## What Was Added

Three new validation checks were added to the `validateReservation` function in `server.js`:

1. **Minimum Duration Check** - 15 minutes
2. **Maximum Duration Check** - 8 hours
3. **Maximum Future Date Check** - 90 days

---

## Detailed Code Breakdown

### Duration Validation

```javascript
// Calculate the duration in milliseconds
const durationMs = end - start;

// Define minimum and maximum durations
const minDuration = 15 * 60 * 1000; // 15 minutes = 900,000 ms
const maxDuration = 8 * 60 * 60 * 1000; // 8 hours = 28,800,000 ms

// Check if too short
if (durationMs < minDuration) {
    return "Reservation must be at least 15 minutes long.";
}

// Check if too long
if (durationMs > maxDuration) {
    return "Reservation cannot exceed 8 hours.";
}
```

**How it works:**
- Subtracting two `Date` objects gives you the difference in **milliseconds**
- We convert our limits to milliseconds for comparison:
  - 15 minutes = 15 × 60 seconds × 1000 ms = 900,000 ms
  - 8 hours = 8 × 60 minutes × 60 seconds × 1000 ms = 28,800,000 ms

**Example:**
```
Start: 2026-01-23 10:00:00
End:   2026-01-23 10:10:00
Duration: 10 minutes (600,000 ms)
Result: ❌ "Reservation must be at least 15 minutes long."

Start: 2026-01-23 10:00:00
End:   2026-01-23 20:00:00
Duration: 10 hours (36,000,000 ms)
Result: ❌ "Reservation cannot exceed 8 hours."

Start: 2026-01-23 10:00:00
End:   2026-01-23 12:00:00
Duration: 2 hours (7,200,000 ms)
Result: ✅ Valid
```

---

### Future Date Validation

```javascript
// Define the maximum advance booking period
const maxFutureDays = 90;

// Calculate the furthest allowed date
const maxFutureDate = new Date(now.getTime() + maxFutureDays * 24 * 60 * 60 * 1000);

// Check if the reservation is too far in the future
if (start > maxFutureDate) {
    return `Reservations can only be made up to ${maxFutureDays} days in advance.`;
}
```

**How it works:**
- Get the current time in milliseconds: `now.getTime()`
- Add 90 days worth of milliseconds:
  - 90 days × 24 hours × 60 minutes × 60 seconds × 1000 ms
  - = 90 × 86,400,000 ms = 7,776,000,000 ms (90 days)
- Create a new `Date` object representing 90 days from now
- Compare the reservation start time to this limit

**Example:**
```
Today: 2026-01-22
Max future date: 2026-04-22 (90 days from today)

Reservation start: 2026-02-15
Result: ✅ Valid (within 90 days)

Reservation start: 2026-06-01
Result: ❌ "Reservations can only be made up to 90 days in advance."
```

---

## Complete Validation Flow

The function now validates in this order:

```
1. Check date format
   ↓
2. Check start < end
   ↓
3. Check not in past
   ↓
4. Check duration ≥ 15 min    ← NEW
   ↓
5. Check duration ≤ 8 hours   ← NEW
   ↓
6. Check start ≤ 90 days      ← NEW
   ↓
7. Check no overlaps
   ↓
   Return null (valid!) or error message
```

---

## Code Changes

### File: `server.js`

**Lines 17-70 - Updated `validateReservation` function**

```diff
 const validateReservation = (newReservation) => {
     const start = new Date(newReservation.startTime);
     const end = new Date(newReservation.endTime);
     const now = new Date();
 
     if (isNaN(start.getTime()) || isNaN(end.getTime())) {
         return "Invalid date format.";
     }
 
     if (start >= end) {
         return "Start time must be before end time.";
     }
 
     if (start < now) {
         return "Reservations cannot be made in the past.";
     }
 
+    // Duration validation
+    const durationMs = end - start;
+    const minDuration = 15 * 60 * 1000; // 15 minutes in milliseconds
+    const maxDuration = 8 * 60 * 60 * 1000; // 8 hours in milliseconds
+
+    if (durationMs < minDuration) {
+        return "Reservation must be at least 15 minutes long.";
+    }
+
+    if (durationMs > maxDuration) {
+        return "Reservation cannot exceed 8 hours.";
+    }
+
+    // Future date validation
+    const maxFutureDays = 90;
+    const maxFutureDate = new Date(now.getTime() + maxFutureDays * 24 * 60 * 60 * 1000);
+    
+    if (start > maxFutureDate) {
+        return `Reservations can only be made up to ${maxFutureDays} days in advance.`;
+    }
+
     // Overlap check
     const overlapping = reservations.find(res => {
         if (res.roomId !== newReservation.roomId) return false;
         const resStart = new Date(res.startTime);
         const resEnd = new Date(res.endTime);
 
         return (start < resEnd && end > resStart);
     });
 
     if (overlapping) {
         return "Reservation overlaps with an existing one for the same room.";
     }
 
     return null;
 };
```

---

## Why These Specific Values?

### 15 Minutes Minimum
- **Prevents** spam or accidental quick clicks
- **Ensures** reasonable minimum for any meaningful room use
- **Standard** common practice in booking systems
- **Adjustable** can be changed to 30 minutes if needed

### 8 Hours Maximum
- **Prevents** users from blocking rooms all day
- **Ensures** fair access to limited resources
- **Allows** for a full workday meeting if needed
- **Flexible** can be adjusted based on your business needs

### 90 Days Future Limit
- **Balances** planning ahead with unpredictable future needs
- **Prevents** "room squatting" years in advance
- **Standard** in many booking systems (hotels, conference rooms, etc.)
- **Configurable** can be adjusted (30, 60, 180 days) based on requirements

---

## Configuration

These values are defined as **constants** for easy adjustment:

```javascript
const minDuration = 15 * 60 * 1000;      // Change to 30 * 60 * 1000 for 30 minutes
const maxDuration = 8 * 60 * 60 * 1000;  // Change to 4 * 60 * 60 * 1000 for 4 hours
const maxFutureDays = 90;                 // Change to 60 for 60 days
```

To modify the limits:
1. Update the constant values in `server.js`
2. Restart the server
3. The new limits take effect immediately

---

## Error Messages

### Minimum Duration Violation
**Request:**
```json
{
  "roomId": "room-1",
  "startTime": "2026-01-23T10:00:00Z",
  "endTime": "2026-01-23T10:05:00Z"
}
```

**Response:**
```json
{
  "error": "Reservation must be at least 15 minutes long."
}
```
**Status Code:** `400 Bad Request`

---

### Maximum Duration Violation
**Request:**
```json
{
  "roomId": "room-1",
  "startTime": "2026-01-23T09:00:00Z",
  "endTime": "2026-01-23T18:00:00Z"
}
```

**Response:**
```json
{
  "error": "Reservation cannot exceed 8 hours."
}
```
**Status Code:** `400 Bad Request`

---

### Future Date Violation
**Request:**
```json
{
  "roomId": "room-1",
  "startTime": "2026-05-01T10:00:00Z",
  "endTime": "2026-05-01T11:00:00Z"
}
```

**Response:**
```json
{
  "error": "Reservations can only be made up to 90 days in advance."
}
```
**Status Code:** `400 Bad Request`

---

## Testing

### Manual Testing

#### Test Too Short Duration
```bash
curl -X POST http://localhost:3000/reservations \
  -H "Content-Type: application/json" \
  -d '{
    "roomId": "room-1",
    "startTime": "2026-01-23T10:00:00Z",
    "endTime": "2026-01-23T10:05:00Z"
  }'
```

**Expected:** `400 Bad Request` with error message

#### Test Too Long Duration
```bash
curl -X POST http://localhost:3000/reservations \
  -H "Content-Type: application/json" \
  -d '{
    "roomId": "room-1",
    "startTime": "2026-01-23T09:00:00Z",
    "endTime": "2026-01-23T20:00:00Z"
  }'
```

**Expected:** `400 Bad Request` with error message

#### Test Too Far in Future
```bash
curl -X POST http://localhost:3000/reservations \
  -H "Content-Type: application/json" \
  -d '{
    "roomId": "room-1",
    "startTime": "2026-06-01T10:00:00Z",
    "endTime": "2026-06-01T11:00:00Z"
  }'
```

**Expected:** `400 Bad Request` with error message

#### Test Valid Reservation
```bash
curl -X POST http://localhost:3000/reservations \
  -H "Content-Type: application/json" \
  -d '{
    "roomId": "room-1",
    "startTime": "2026-01-23T10:00:00Z",
    "endTime": "2026-01-23T12:00:00Z"
  }'
```

**Expected:** `201 Created` with reservation object

---

## Edge Cases

### Exactly 15 Minutes
```javascript
Duration: 900,000 ms (exactly 15 minutes)
Result: ✅ Valid (>= minDuration)
```

### Exactly 8 Hours
```javascript
Duration: 28,800,000 ms (exactly 8 hours)
Result: ✅ Valid (<= maxDuration)
```

### Exactly 90 Days
```javascript
Start: Exactly 90 days from now
Result: ✅ Valid (<= maxFutureDate)
```

### 90 Days + 1 Second
```javascript
Start: 90 days + 1 second from now
Result: ❌ Too far in future
```

---

## Impact on Users

### Positive
- ✅ Prevents unrealistic reservations
- ✅ Ensures fair resource allocation
- ✅ Reduces system abuse
- ✅ Clear error messages guide users
- ✅ Improves data quality

### Considerations
- ⚠️ Users planning far ahead need to book closer to the date
- ⚠️ Very long meetings need to be split into multiple reservations
- ⚠️ Edge cases (holidays, special events) may need manual handling

---

## Future Enhancements

### Possible Improvements
1. **Different limits per room type**
   - Small rooms: max 2 hours
   - Large conference rooms: max 8 hours
   
2. **Time-of-day rules**
   - Peak hours: max 4 hours
   - Off-peak: max 8 hours

3. **User role-based limits**
   - Regular users: 90 days advance
   - Admins: 180 days advance

4. **Configurable via environment variables**
   ```javascript
   const minDuration = process.env.MIN_DURATION || 15 * 60 * 1000;
   ```

---

## Summary

**What Changed:**  
Added 3 new validation rules to `validateReservation()` in `server.js`

**What Was Added:**
1. Minimum duration: 15 minutes
2. Maximum duration: 8 hours  
3. Maximum future booking: 90 days

**Why:**  
Prevent unrealistic, abusive, or impractical reservations

**How:**  
- Calculate duration in milliseconds and compare to limits
- Calculate future date limit and compare reservation start time
- Return descriptive error messages when limits are exceeded

**Result:**  
More robust, production-ready reservation system with sensible constraints

---

## Related Files
- [server.js](file:///c:/code/conferenceroom/server.js) - Main server file with validation logic
- [Race Condition Fix](file:///c:/code/conferenceroom/docs/race_condition_fix.md) - Related validation improvements
- [Room Reservation Analysis](file:///c:/code/conferenceroom/docs/room-reservation-analysis.md) - Full system analysis
