# Quick Start Commands

## Run Legacy MVP (Port 3000)
```bash
node server.js
```
→ http://localhost:3000

---

## Run New React + Vite Version

### Terminal 1 - Backend (Port 3001)
```bash
cd backend
npm start
```

### Terminal 2 - Frontend (Port 5173)
```bash
cd frontend
npm run dev
```
→ http://localhost:5173

---

## Run Both Versions Simultaneously
Open 3 terminals and run:
1. `node server.js` (Legacy - port 3000)
2. `cd backend && npm start` (New backend - port 3001)
3. `cd frontend && npm run dev` (New frontend - port 5173)
