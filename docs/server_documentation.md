# Server Code Documentation

## Overview
This document explains the JSDoc documentation added to `server.js`. The goal was to make the codebase more maintainable and easier to understand by explicitly defining business rules, parameters, and return signatures.

---

## What is JSDoc?
JSDoc is a standard for commenting JavaScript code. It allows IDEs (like VS Code) to provide better autocomplete and inline documentation.

**Example from our code:**
```javascript
/**
 * @param {string} id - The UUID of the reservation
 * @returns {204} No Content on success
 */
```

---

## Documented Components

### 1. Business Logic: `validateReservation`

We explicitly documented the 6 core business rules enforced by this function:

1. **Date Validity**: Checks if dates are valid numbers.
2. **Time Order**: Start time must be before end time.
3. **Future Only**: Start time cannot be in the past.
4. **Duration Limits**: Must be between 15 minutes and 8 hours.
5. **Advance Booking Limit**: Max 90 days in advance.
6. **No Overlaps**: Checks existing reservations for time conflicts.

**JSDoc Signature:**
```javascript
/**
 * @param {Object} newReservation
 * @returns {string|null} Error message or null
 */
```

---

### 2. API Endpoints

We added documentation for all three REST endpoints:

#### GET /reservations
- **Purpose**: Retrieve reservations.
- **Parameters**: Optional `roomId` query parameter.
- **Returns**: Array of reservation objects.

#### POST /reservations
- **Purpose**: Create a new reservation.
- **Body**: Requires `roomId`, `startTime`, `endTime`.
- **Validation**: documentation states it throws 400 for validation errors.
- **Concurrency**: Mentions the use of promise-based locks.

#### DELETE /reservations/:id
- **Purpose**: Cancel a reservation.
- **Parameters**: `id` (UUID) in the URL path.
- **Response**: 204 No Content on success, 404 if not found.

---

## Benefits of This Documentation

1. **IntelliSense**: Hovering over `validateReservation` in the editor now shows all business rules.
2. **Maintenance**: Future developers know exactly what each endpoint expects without reading the implementation.
3. **Safety**: Explicitly stating return types (like `string|null`) prevents null-reference errors.

---

## Related Files
- [server.js](file:///c:/code/conferenceroom/server.js) - The documented server code.
