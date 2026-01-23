# Testing the Setup

## Steps to Test

1. **Start the backend:**
   ```bash
   cd backend
   npm start
   ```
   You should see: `JSON Server started on http://localhost:3001`

2. **In a new terminal, start the frontend:**
   ```bash
   cd frontend
   npm run dev
   ```
   You should see: `Local: http://localhost:5173/`

3. **Open your browser:**
   - Go to: http://localhost:5173
   - You should see:
     - "Room Reservation System" heading
     - List of 3 rooms (Conference Room 1, 2, 3)
     - Green success message: "✅ Backend connection successful!"

## Expected Result

```
Room Reservation System

Available Rooms
  Conference Room 1      Capacity: 10 people
  Conference Room 2      Capacity: 6 people
  Conference Room 3      Capacity: 4 people

✅ Backend connection successful!
```

## Troubleshooting

**If you see "Failed to fetch rooms":**
- Make sure JSON Server is running on port 3001
- Check that `backend/db.json` exists
- Verify no CORS errors in browser console

**If frontend won't start:**
- Make sure you're in the `frontend/` directory
- Run `npm install` if you haven't already
