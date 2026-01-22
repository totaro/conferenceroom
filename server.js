
const express = require('express');
const crypto = require('crypto');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

// Serve index.html at the root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

let reservations = [];

// Promise-based lock to prevent race conditions
let reservationLock = Promise.resolve();

// Business Rules Enforcement
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

// GET /reservations
app.get('/reservations', (req, res) => {
    const { roomId } = req.query;
    if (roomId) {
        return res.json(reservations.filter(r => r.roomId === roomId));
    }
    res.json(reservations);
});

// POST /reservations
app.post('/reservations', (req, res) => {
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
        if (!res.headersSent) {
            res.status(500).json({ error: "Internal server error" });
        }
    });
});

// DELETE /reservations/:id
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

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
