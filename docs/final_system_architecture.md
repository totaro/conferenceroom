# 🏛️ The Final System Architecture: How It Works

This document is the "Blueprints" for your finished **Mythical Cities Reservation System**. It explains exactly how the final application is built, using simple terms and visual diagrams.

---

## 1. The Big Picture
Your application is not just one file anymore. It is a **System** composed of two distinct parts that talk to each other.

```text
       USER'S COMPUTER                        SERVER
   +----------------------+           +----------------------+
   |                      |           |                      |
   |   [ FRONTEND ]       |           |    [ BACKEND ]       |
   |   React + Vite       |  <----->  |    JSON Server       |
   |   (Port 5173)        |   Unseen  |    (Port 3001)       |
   |                      |   Wires   |                      |
   +----------------------+           +----------------------+
```

*   **Frontend (The Face):** What you see and click. It lives in the browser.
*   **Backend (The Brain):** What saves the data. It lives on the server.

---

## 2. Frontend Components (The Lego Blocks)
We built the interface using **React Components**. Think of these as Lego blocks. We put small blocks together to make the full app.

### Visual Component Tree
This is how your screen is constructed:

```text
+-------------------------------------------------------+
|  <App />  (The Container)                             |
|                                                       |
|  +-------------------------------------------------+  |
|  |  <Notification />  (Pop-up Toasts)              |  |
|  +-------------------------------------------------+  |
|                                                       |
|  +-------------------------------------------------+  |
|  |  Room Selection Dropdown                        |  |
|  +-------------------------------------------------+  |
|                                                       |
|  +-------------------------------------------------+  |
|  |  <Calendar />                                   |  |
|  |  (The Big Grid: react-big-calendar)             |  |
|  +-------------------------------------------------+  |
|                                                       |
|       (When you click a slot...)                      |
|       v                                               |
|  +-------------------------------------------------+  |
|  |  <Modal>                                        |  |
|  |     +---------------------------------------+   |  |
|  |     |  <BookingForm />                      |   |  |
|  |     |  (Inputs, Validation Logic)           |   |  |
|  |     +---------------------------------------+   |  |
|  +-------------------------------------------------+  |
|                                                       |
+-------------------------------------------------------+
```

---

## 3. The Data Journey (A "Save" Trip)
What happens when you click **"Confirm Reservation"**? The data takes a journey.

### Step-by-Step Flow

1.  **Preparation:** The `BookingForm` gathers your inputs (Name, Time, Room).
2.  **Validation:** The app checks: *"Is the room full? Is the time in the past?"*
    *   ❌ If Bad: Shows a Red Error.
    *   ✅ If Good: Packages data into a JSON packet.
3.  **Transmission:** React uses `fetch()` to send this packet to Port 3001.

```text
    BROWSER                                    API (Port 3001)
   +---------+                                +---------------+
   | React   | --(POST /reservations)------>  |  JSON Server  |
   +---------+        {data}                  +---------------+
        ^                                             |
        |                                             | (Writes to disk)
        |                                             v
   (Update UI)                                +---------------+
   (Show Success) <--(201 Created)----------  |  db.json      |
                                              +---------------+
```

4.  **Confirmation:** The server says "OK" (201 Created).
5.  **Reaction:**
    *   The Modal closes.
    *   A Green Toast Notification pops up (`<Notification />`).
    *   The Calendar automatically refreshes to show the new blue block.

---

## 4. Key Technologies Used

| Technology | Role | Why we used it? |
| :--- | :--- | :--- |
| **React** | Framework | Makes the UI "Smart" and reactive. |
| **Vite** | Builder | Makes development super fast (Hot Reload). |
| **Moment.js** | Time | Handles the "Monday Start" and dates correctly. |
| **CSS Variables** | Styling | Makes it easy to change the "Theme" (colors/fonts) in one place. |
| **JSON Server** | Database | A full Fake API without needing complex SQL setup. |

---

## 5. Future Possibilities 🚀
Now that you have this solid architecture, you can easily add:
*   **User Login:** Identify who is booking ("Alan" vs "Rawreal").
*   **Real Database:** Swap `db.json` for MongoDB or PostgreSQL (Backend change only!).
*   **Email Notifications:** Send real emails when a booking is confirmed.
