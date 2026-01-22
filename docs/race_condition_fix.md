# Race Condition Fix - Detailed Explanation

## The Problem

### What is a Race Condition?
A race condition occurs when two operations happen at nearly the same time and "race" to complete, causing unexpected behavior.

### In This Application
Imagine two users trying to book the same time slot simultaneously:

**Without the fix:**
```
Time: 0ms
User A: Check if 10:00-11:00 is available → ✅ Available
User B: Check if 10:00-11:00 is available → ✅ Available

Time: 5ms  
User A: Create reservation for 10:00-11:00 → ✅ Success
User B: Create reservation for 10:00-11:00 → ✅ Success (PROBLEM!)

Result: Two overlapping reservations! 😱
```

The validation and insertion weren't **atomic** (happening as one indivisible operation), so both requests could pass validation before either one was inserted.

---

## The Solution: Promise-Based Lock

### Code Changes

#### 1. Created a Lock Variable
```javascript
// At the top of server.js, after let reservations = [];
let reservationLock = Promise.resolve();
```

This creates a promise that starts in a "resolved" state, ready to accept the first request.

#### 2. Changed the POST Endpoint

**Before:**
```javascript
app.post('/reservations', (req, res) => {
    // Validate immediately
    const error = validateReservation({ roomId, startTime, endTime });
    if (error) {
        return res.status(400).json({ error });
    }
    
    // Insert immediately  
    reservations.push(newReservation);
    res.status(201).json(newReservation);
});
```

**After:**
```javascript
app.post('/reservations', (req, res) => {
    // Chain this request onto the previous lock
    reservationLock = reservationLock.then(() => {
        // Validate
        const error = validateReservation({ roomId, startTime, endTime });
        if (error) {
            res.status(400).json({ error });
            return;
        }
        
        // Insert
        reservations.push(newReservation);
        res.status(201).json(newReservation);
    }).catch(err => {
        // Error handling
        console.error('Error processing reservation:', err);
        if (!res.headersSent) {
            res.status(500).json({ error: "Internal server error" });
        }
    });
});
```

---

## How It Works

### Promise Chaining Creates a Queue

Think of it like a single-file line at a coffee shop:

```
Request 1 arrives → Lock: Promise.resolve() 
                   → Process Request 1
                   → Lock: new Promise (waiting for Request 1)

Request 2 arrives → Lock: Promise (from Request 1)
                   → WAITS for Request 1 to finish
                   → Process Request 2
                   → Lock: new Promise (waiting for Request 2)

Request 3 arrives → Lock: Promise (from Request 2)
                   → WAITS for Request 2 to finish
                   → Process Request 3
```

### With the Fix
```
Time: 0ms
User A: Join the queue → Start processing
User B: Join the queue → WAIT for User A

Time: 5ms  
User A: Check if 10:00-11:00 is available → ✅ Available
User A: Create reservation → ✅ Success
User A: Done! User B can proceed

Time: 10ms
User B: Check if 10:00-11:00 is available → ❌ Occupied (by User A)
User B: Validation fails → ❌ Error returned

Result: Only ONE reservation created! ✅
```

---

## Key Concepts

### 1. Promise Chaining
```javascript
reservationLock = reservationLock.then(() => { ... });
```

Each request creates a new promise that depends on the previous one. This creates a chain where each operation waits for the previous one to complete.

### 2. Atomic Operations
By wrapping both validation AND insertion in the same `.then()` callback, we ensure they happen together without interruption.

### 3. Error Handling
```javascript
.catch(err => {
    console.error('Error processing reservation:', err);
    if (!res.headersSent) {
        res.status(500).json({ error: "Internal server error" });
    }
});
```

The `if (!res.headersSent)` check prevents trying to send a response twice, which would crash the server.

---

## Visual Diagram

### Before (Race Condition)
```
┌─────────────────────┐  ┌─────────────────────┐
│    Request A        │  │    Request B        │
│                     │  │                     │
│  1. Validate ✅     │  │  1. Validate ✅     │
│  2. Insert          │  │  2. Insert          │
│     ↓               │  │     ↓               │
│  [Reservation A]    │  │  [Reservation B]    │
│                     │  │                     │
│  Both see empty!    │  │  Both succeed!      │
└─────────────────────┘  └─────────────────────┘
         ↓                        ↓
    OVERLAPPING RESERVATIONS! ❌
```

### After (Promise Lock)
```
┌─────────────────────┐       ┌─────────────────────┐
│    Request A        │       │    Request B        │
│                     │       │                     │
│  1. Get Lock ✅     │       │  1. Wait for Lock ⏳│
│  2. Validate ✅     │       │                     │
│  3. Insert ✅       │       │                     │
│  [Reservation A]    │       │                     │
│  4. Release Lock    │       │                     │
│         ↓           │       │         ↓           │
└─────────────────────┘       │  2. Get Lock ✅     │
                              │  3. Validate ❌     │
                              │     (sees A!)       │
                              │  4. Return Error    │
                              └─────────────────────┘
         ↓
    ONE RESERVATION ONLY! ✅
```

---

## Complete Code Changes

### File: `server.js`

**Lines 11-14 (Added):**
```javascript
let reservations = [];

// Promise-based lock to prevent race conditions
let reservationLock = Promise.resolve();
```

**Lines 58-89 (Modified):**
```diff
 // POST /reservations
 app.post('/reservations', (req, res) => {
     const { roomId, startTime, endTime } = req.body;
 
     if (!roomId || !startTime || !endTime) {
         return res.status(400).json({ error: "Missing required fields." });
     }
 
-    const error = validateReservation({ roomId, startTime, endTime });
-    if (error) {
-        return res.status(400).json({ error });
-    }
-
-    const newReservation = {
-        id: crypto.randomUUID(),
-        roomId,
-        startTime,
-        endTime
-    };
-
-    reservations.push(newReservation);
-    res.status(201).json(newReservation);
+    // Use promise chaining to ensure atomic validation and insertion
+    reservationLock = reservationLock.then(() => {
+        const error = validateReservation({ roomId, startTime, endTime });
+        if (error) {
+            res.status(400).json({ error });
+            return;
+        }
+
+        const newReservation = {
+            id: crypto.randomUUID(),
+            roomId,
+            startTime,
+            endTime
+        };
+
+        reservations.push(newReservation);
+        res.status(201).json(newReservation);
+    }).catch(err => {
+        console.error('Error processing reservation:', err);
+        if (!res.headersSent) {
+            res.status(500).json({ error: "Internal server error" });
+        }
+    });
 });
```

---

## Testing the Fix

### Manual Test
You can't easily test this manually because the race condition requires near-simultaneous requests.

### Automated Test (Example)
```javascript
// This would require a testing framework
async function testRaceCondition() {
    const reservation = {
        roomId: 'room-1',
        startTime: '2026-01-23T10:00:00Z',
        endTime: '2026-01-23T11:00:00Z'
    };
    
    // Send two identical requests at the same time
    const [result1, result2] = await Promise.all([
        fetch('http://localhost:3000/reservations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reservation)
        }),
        fetch('http://localhost:3000/reservations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reservation)
        })
    ]);
    
    // One should succeed (201), one should fail (400)
    const statuses = [result1.status, result2.status].sort();
    console.assert(
        statuses[0] === 201 && statuses[1] === 400,
        'Race condition not fixed!'
    );
}
```

---

## Limitations

### This Solution Works For:
- ✅ In-memory storage (what we have)
- ✅ Single server instance
- ✅ Small to medium traffic

### This Solution Does NOT Work For:
- ❌ Multiple server instances (load-balanced)
- ❌ Database-backed storage (use database transactions instead)
- ❌ Very high traffic (can become a bottleneck)

### For Production
You'd typically use:
- **Database transactions** (for databases like PostgreSQL)
  ```sql
  BEGIN TRANSACTION;
  -- Check for conflicts
  -- Insert if no conflicts
  COMMIT;
  ```
- **Optimistic locking** (version numbers)
- **Distributed locks** (Redis, Memcached, etc.)

---

## Performance Considerations

### Throughput Impact
With the lock, requests are processed **sequentially** instead of in parallel.

**Before:** 1000 requests/second (parallel)  
**After:** ~100 requests/second (sequential, assuming 10ms per request)

For a room reservation system with moderate traffic, this is acceptable. For high-traffic systems, you'd need a database with proper transaction support.

### When to Worry
- If you have more than 100-200 reservations per second
- If you need to scale horizontally (multiple servers)
- If validation becomes complex and slow

---

## Summary

**Problem:** Race condition allowed overlapping reservations  
**Solution:** Promise-based lock ensures sequential processing  
**Result:** Atomic validation and insertion  
**Trade-off:** Reduced throughput (acceptable for this use case)

By using promise chaining, we turned parallel requests into sequential requests, ensuring that validation and insertion happen atomically - fixing the race condition where two users could book the same time slot.
