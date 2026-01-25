# Technical Architecture Overview: Conference Room App

This document provides a deep dive into the system design, component logic, and data flow of the Conference Room Reservation application.

---

## 📦 High-Level Architecture

The application follows a standard **Client-Server** architecture:

```text
      FRONTEND (React + Vite)                    BACKEND (Node.js)
+---------------------------------+          +-----------------------+
|  [App.jsx] ---> [BookingForm]   |          |                       |
|       |                         |          |                       |
|       v                         |  HTTP    |  [server.js] (Setup)  |
|  [Calendar]     [Modal]         | <------> |          |            |
|                                 |  JSON    |          v            |
|  (State: reservations, rooms)   |          |      [db.json]        |
|                                 |          |                       |
+---------------------------------+          +-----------------------+
```

*   **Frontend:** A Single Page Application (SPA) built with **React**, leveraging hooks for state management and `react-big-calendar`.
*   **Backend:** A restful API provided by `json-server`, serving as a lightweight database overlay on top of a `db.json` file.
*   **Communication:** Asynchronous HTTP requests (`GET`, `POST`, `DELETE`) using the native `fetch` API.

---

## 📂 Project Structure

*   **/frontend**: React source code.
    *   `src/App.jsx`: The "Brain" of the app. Manages global state (`rooms`, `reservations`) and orchestrates views.
    *   `src/components/`: (Logical separation) Modals, Forms, and Lists are implemented within App or as sub-components.
    *   `src/App.css`: Centralized Design System (Variables) and specific component styling.
*   **/backend**: API and Persistence.
    *   `db.json`: The source of truth (Database). Stores `rooms` and `reservations` arrays.
    *   `package.json`: Configures the json-server startup scripts.

---

## 🛠️ Feature Deep-Dives

### 1. State Management & Data Flow
The `App.jsx` handles the central **Source of Truth**.

*   **Initial Load:** `useEffect` triggers concurrent fetches for `http://localhost:3001/rooms` and `reservations`.
*   **Reactivity:** When a reservation is created (POST) or deleted (DELETE), the frontend waits for the server response (200 OK) before re-fetching data to keep the Calendar UI in sync.

### 2. The Calendar System
We utilize `react-big-calendar` wrapped with a `moment.js` localizer.

*   **Localization:** Configured for **Monday Start** and **24h Time** using `moment.locale('en-gb')`.
*   **Interaction:** Clicking a slot triggers `handleSelectSlot`, which captures the `start` and `end` times and opens the Booking Modal.
*   **Events:** Raw JSON data is mapped to calendar objects: `{ title, start: new Date(), end: new Date() }`.

### 3. Smart Validation Logic
Validation happens on the Client Side before any request is sent.

*   **Overlap Detection:** Algorithm checks if `(NewStart < ExistingEnd) && (NewEnd > ExistingStart)` for the same room.
*   **Business Rules:** Prevents booking in the past, booking without a room, or booking end times before start times.
*   **Feedback:** Sets `formErrors` state which conditionally renders error messages below inputs.

### 4. Visual Feedback System
Users are never left guessing state changes.

*   **Loading:** Conditional rendering displays a generic load screen for rooms, and a specific "Overlay Spinner" for calendar data.
*   **Toasts:** A custom `Notification` system flashes success (green) or error (red) messages at the top of the viewport.
*   **Confirmations:** Destructive actions (Delete) triggers a secondary "Are you sure?" modal layer.

---

## ⚡ Key Functions Reference

| Function | Context | Purpose |
| :--- | :--- | :--- |
| `handleSelectSlot` | Calendar | Captures drag/click times and opens the Create Modal. |
| `handleSelectEvent` | Calendar | Opens the "Details" Modal for an existing reservation. |
| `handleConfirmDelete` | Modal | Executes `DELETE` request and cleans up UI state. |
| `checkOverlap` | Validation | Boolean logic to ensure no double-booking occurs. |
| `showNotification` | UI Utility | Triggers the ephemeral toast message with a timeout. |

---

## 🚀 Performance & UI UX

*   **Optimistic UI:** While we wait for server confirmation, we block interaction (`disabled` states) to prevent race conditions.
*   **CSS Variables:** We use `:root` variables (e.g., `--primary-blue`, `--glass-bg`) to maintain a consistent "Glassmorphism" theme.
*   **Responsive:** The layout flexes (CSS Flexbox) to accommodate different screen sizes, ensuring the calendar remains usable.
*   **Persistence:** `json-server` writes to disk instantly, so data survives server restarts.
