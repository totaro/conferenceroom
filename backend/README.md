# Backend - JSON Server

This is the JSON Server backend for the new React + Vite version.

## Port Configuration
- **Backend (JSON Server)**: http://localhost:3001
- **Frontend (Vite)**: http://localhost:5173

## Running the Backend

```bash
cd backend
npm start
```

## API Endpoints

- `GET /reservations` - Get all reservations
- `GET /reservations?roomId=room-1` - Filter by room
- `POST /reservations` - Create a new reservation
- `DELETE /reservations/:id` - Delete a reservation
- `GET /rooms` - Get all available rooms

## Database

Data is stored in `db.json` and persists between server restarts.
