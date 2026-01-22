

// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const crypto = require('crypto');
const path = require('path');

const app = express();
// Use environment variable PORT if available, otherwise default to 3000
// To set a custom port, create a .env file with: PORT=8080
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// Request logging middleware
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`${timestamp} - ${req.method} ${req.path}`);
    next();
});

// Serve index.html at the root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

let reservations = [];

// Promise-based lock to prevent race conditions
let reservationLock = Promise.resolve();

/**
 * Validates a reservation against business rules.
 * 
 * Rules:
 * 1. Dates must be valid
 * 2. Start time must be before end time
 * 3. Start time cannot be in the past
 * 4. Duration must be between 15 minutes and 8 hours
 * 5. Reservation cannot be more than 90 days in advance
 * 6. No overlapping reservations for the same room
 * 
 * @param {Object} newReservation - The reservation object to validate
 * @param {string} newReservation.roomId - The ID of the room
 * @param {string} newReservation.startTime - ISO 8601 start time
 * @param {string} newReservation.endTime - ISO 8601 end time
 * @returns {string|null} Error message if invalid, null if valid
 */
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

    // Duration validation
    const durationMs = end - start;
    const minDuration = 15 * 60 * 1000; // 15 minutes in milliseconds
    const maxDuration = 8 * 60 * 60 * 1000; // 8 hours in milliseconds

    if (durationMs < minDuration) {
        return "Reservation must be at least 15 minutes long.";
    }

    if (durationMs > maxDuration) {
        return "Reservation cannot exceed 8 hours.";
    }

    // Future date validation
    const maxFutureDays = 90;
    const maxFutureDate = new Date(now.getTime() + maxFutureDays * 24 * 60 * 60 * 1000);

    if (start > maxFutureDate) {
        return `Reservations can only be made up to ${maxFutureDays} days in advance.`;
    }

    // Overlap check
    const overlapping = reservations.find(res => {
        if (res.roomId !== newReservation.roomId) return false;
        const resStart = new Date(res.startTime);
        const resEnd = new Date(res.endTime);

        // Checks if intervals [start, end] and [resStart, resEnd] overlap
        return (start < resEnd && end > resStart);
    });

    if (overlapping) {
        return "Reservation overlaps with an existing one for the same room.";
    }

    return null;
};

/**
 * GET /reservations
 * Retrieves all reservations, optionally filtered by room ID.
 * 
 * @query {string} [roomId] - Optional room ID to filter results
 * @returns {Array<Object>} List of reservation objects
 */
app.get('/reservations', (req, res) => {
    const { roomId } = req.query;
    if (roomId) {
        return res.json(reservations.filter(r => r.roomId === roomId));
    }
    res.json(reservations);
});

/**
 * POST /reservations
 * Creates a new reservation if it passes all validation rules.
 * Uses a promise-based lock to prevent race conditions during concurrent requests.
 * 
 * @body {string} roomId - The ID of the room
 * @body {string} startTime - ISO 8601 start time string
 * @body {string} endTime - ISO 8601 end time string
 * @returns {Object} Created reservation object with ID
 * @throws {400} If validation fails
 * @throws {500} If internal server error occurs
 */
app.post('/reservations', (req, res, next) => {
    const { roomId, startTime, endTime } = req.body;

    if (!roomId || !startTime || !endTime) {
        return res.status(400).json({ error: "Missing required fields." });
    }

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

    // Use promise chaining to ensure atomic validation and insertion
    reservationLock = reservationLock.then(() => {
        const error = validateReservation({ roomId, startTime, endTime });
        if (error) {
            res.status(400).json({ error });
            return;
        }

        const newReservation = {
            id: crypto.randomUUID(),
            roomId,
            startTime,
            endTime
        };

        reservations.push(newReservation);
        res.status(201).json(newReservation);
    }).catch(err => {
        console.error('Error processing reservation:', err);
        // Pass error to the global error handler
        next(err);
    });
});

/**
 * DELETE /reservations/:id
 * cancel a reservation by ID.
 * 
 * @param {string} id - The UUID of the reservation to delete
 * @returns {204} No Content on success
 * @throws {404} If reservation is not found
 */
app.delete('/reservations/:id', (req, res) => {
    const { id } = req.params;
    console.log(`DELETE request received for reservation ID: ${id}`);
    const initialLength = reservations.length;
    reservations = reservations.filter(r => r.id !== id);

    if (reservations.length === initialLength) {
        console.warn(`Reservation not found: ${id}`);
        return res.status(404).json({ error: "Reservation not found." });
    }

    console.log(`Successfully deleted reservation: ${id}`);
    res.status(204).send();
});

/**
 * Global Error Handler Middleware
 * Catches any unhandled errors and ensures a consistent JSON response.
 */
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err);

    // Prevent double-sending headers
    if (res.headersSent) {
        return next(err);
    }

    res.status(500).json({
        error: "Internal Server Error",
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
