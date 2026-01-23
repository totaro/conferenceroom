# AntiGravity Prompts - Room Reservation Step-by-Step (Context-Aware)

## How to Use These Prompts

**IMPORTANT:** Before starting, tell AntiGravity about your existing project:

### Initial Context Message (Send this FIRST):
```
I have a working room reservation MVP with these files:
- index.html (frontend with vanilla JavaScript)
- server.js (Express backend with in-memory storage)

I want to upgrade this to a React + Vite SPA with JSON Server backend. 
I'll be asking you to help me build this step-by-step, one feature at a time.
Please keep track of our progress and build on what we've already done.

Ready to start?
```

**Then use the prompts below, one at a time.**

---

## Phase 1: Foundation

### Prompt 1: Create New Project Structure (Keep Old MVP)
```
I want to create a new React + Vite version of my room reservation app while keeping my current MVP intact.

Please help me:
1. Create a NEW folder structure: frontend/ and backend/ (separate from my existing index.html and server.js)
2. Set up React + Vite in the frontend/ folder
3. Set up JSON Server in the backend/ folder
4. Create db.json with the same room structure my current app uses (room-1, room-2, etc.)
5. Give me commands to run both servers on different ports than my MVP

I want to keep my old MVP running while building the new version, so use different ports.
Show me the exact folder structure and commands.
```

---

### Prompt 2: Create Basic React App Shell
```
Building on the project we just set up:

Now I need a clean starting point in React. Please:
1. Update frontend/src/App.jsx to show "Room Reservation System" heading
2. Remove all Vite boilerplate code we don't need
3. Add a simple fetch test to my JSON Server backend to prove the connection works
4. Display the fetched rooms as a list

This is just to verify everything is connected. Keep it minimal - we'll add the calendar next.
```

---

## Phase 2: Connect Frontend to Backend

### Prompt 3: Add Room Selector (Building on Previous Work)
```
We have rooms displaying as a list. Now let's make it interactive.

Building on our App.jsx:
1. Convert the room list to a dropdown selector
2. Add state to track which room is currently selected
3. Auto-select the first room when the app loads
4. Show the currently selected room name below the dropdown

Keep all the existing fetch logic we already wrote - just enhance the UI.
```

---

## Phase 3: Add Calendar

### Prompt 4: Integrate React Big Calendar
```
We have the room selector working. Now it's time for the calendar.

In our existing App.jsx:
1. Install and import react-big-calendar and moment
2. Add the calendar component BELOW our room selector (keep the selector!)
3. Set it to 600px height and default to week view
4. Don't worry about events yet - just get the empty calendar displaying

Keep everything we've built so far - we're adding to it, not replacing.
```

---

### Prompt 5: Load Reservations onto Calendar
```
The calendar is displaying. Now let's show reservations on it.

Building on what we have:
1. Add some test reservations to backend/db.json (make them for the rooms we already have)
2. Fetch reservations when the selected room changes (we already have the room selector working)
3. Convert reservations to calendar event format
4. Display them on the calendar we added in the last step

The calendar should update automatically when I change the room in the dropdown.
Make sure our existing room selector still works perfectly.
```

---

## Phase 4: Add Booking Functionality

### Prompt 6: Add Click-to-Book Modal
```
Our calendar shows existing reservations. Now users need to create new ones.

In our current App.jsx:
1. Make the calendar selectable (users can click empty time slots)
2. When clicked, open a modal dialog overlay
3. Pre-fill the selected start/end times in state
4. Show a simple modal with a close button

Don't build the form yet - just prove the modal opens/closes when clicking the calendar.
Keep all our existing functionality working (room selector, viewing reservations).
```

---

### Prompt 7: Build Booking Form Inside Modal
```
The modal opens when we click the calendar. Now let's add the booking form.

Inside the modal we created:
1. Add form fields: Title (required), Name (required), Start Time (pre-filled), End Time (pre-filled)
2. Add "Book Room" and "Cancel" buttons
3. Style the form to look clean
4. Add form validation
5. On submit, just console.log the data for now

The modal should close when clicking Cancel. Keep our calendar and room selector working.
```

---

### Prompt 8: Save Reservations to Database
```
Our booking form collects data but doesn't save yet. Let's fix that.

In the form submit handler we just created:
1. Send a POST request to our JSON Server at http://localhost:3000/reservations
2. Include the roomId from our selected room state
3. After successful save, close the modal
4. Refresh the calendar to show the new reservation (we already have the fetch function)
5. Add error handling with alerts

After booking, users should immediately see their reservation on the calendar.
```

---

## Phase 5: Polish and Improvements

### Prompt 9: Add Delete by Clicking Events
```
Users can create reservations but can't delete them. Let's add that.

In our existing calendar:
1. Add an onSelectEvent handler (when users click existing reservations)
2. Show a confirmation dialog "Are you sure you want to cancel?"
3. If confirmed, DELETE the reservation from JSON Server
4. Refresh the calendar (reuse our existing fetch function)
5. Add error handling

We already have the calendar set up - just add this click-to-delete feature.
```

---

### Prompt 10: Add More Form Fields
```
Our booking form works but only has basic fields. Let's enhance it.

In the booking form we built earlier, add these OPTIONAL fields:
1. Email (between Name and Start Time)
2. Number of Participants (after Email)
3. Notes textarea (after Participants)

Style them consistently with our existing form fields.
All data should save to the database when creating reservations.
```

---

### Prompt 11: Add CSS Styling
```
Everything works but looks basic. Let's polish the UI.

In our project:
1. Create frontend/src/index.css with nice styling
2. Add background colors, better fonts, spacing
3. Style calendar events to be blue with hover effects
4. Make buttons more polished
5. Import the CSS in main.jsx

Don't change any functionality - just make what we have look better.
```

---

## Phase 6: Advanced Features

### Prompt 12: Add Form Validation
```
We need to prevent invalid bookings.

In our existing booking form:
1. Validate that end time is after start time
2. Validate that booking isn't in the past
3. Show error messages in the form
4. Prevent submission until valid

Keep all existing form fields and functionality - just add validation.
```

---

### Prompt 13: Show Details Before Delete
```
Right now clicking a reservation immediately asks to delete. Let's improve this.

Replace our current delete behavior:
1. When clicking a reservation, show its details in a modal first
2. Display all fields: title, name, time, email, participants, notes
3. Add a "Delete Reservation" button in this modal
4. Keep the confirmation dialog when deleting

This gives users a chance to review before deleting.
```

---

### Prompt 14: Add Loading States
```
Data fetching happens instantly in development but won't in production. Add loading states.

In our existing App.jsx:
1. Add loading state for rooms fetch
2. Add loading state for reservations fetch
3. Show "Loading..." while fetching
4. Disable room selector while loading
5. Only show calendar after data loads

Keep all existing functionality - just add loading indicators.
```

---

### Prompt 15: Make Mobile Responsive
```
Our app works on desktop but needs mobile improvements.

In our existing app:
1. Make the calendar responsive (adjust height on mobile)
2. Make our modal form responsive and scrollable
3. Ensure form inputs are touch-friendly
4. Make the room dropdown work well on mobile
5. Ensure all buttons are properly sized for touch

Test that everything we've built works on mobile.
```

---

### Prompt 16: Display Room Capacity
```
We have room capacity in the database but don't show it. Let's display it.

Next to our existing room selector:
1. Show the selected room's capacity (e.g., "Capacity: 10 people")
2. Fetch this from the rooms data we're already loading
3. Style it nicely next to the dropdown

Don't change the room selector - just add capacity display alongside it.
```

---

### Prompt 17: Add Success Notifications
```
We use console.log for feedback. Let's add visual notifications.

In our app:
1. Create a simple notification component that appears at the top
2. Show success message when creating a reservation
3. Show success message when deleting a reservation
4. Auto-dismiss after 3 seconds
5. Style with green background

Replace our console.log calls and alert() with this notification system.
```

---

### Prompt 18: Add Reservation Filtering
```
Users might want to find their own reservations. Let's add filtering.

Above our calendar (near the room selector):
1. Add a "Show only my reservations" checkbox
2. Add a text input to filter by name
3. Filter the displayed calendar events based on these inputs
4. Keep all reservations in state - just filter what's shown

Our existing calendar should still work normally when filters are cleared.
```

---

### Prompt 19: Add Edit Functionality
```
Users can create and delete but can't edit. Let's add that.

Enhance our reservation details modal:
1. Add an "Edit" button next to Delete
2. When clicked, open our booking form with pre-filled data
3. Change form title to "Edit Reservation" when editing
4. Change submit button to "Update Reservation"
5. Send PUT request instead of POST when editing

Reuse our existing booking form - just add edit mode to it.
```

---

### Prompt 20: Prevent Double-Booking
```
We need conflict detection to prevent overlapping reservations.

In our booking form:
1. Before allowing booking, check for time conflicts with existing reservations
2. Compare the selected time slot against all reservations for that room
3. If there's overlap, show a clear error message
4. Prevent submission if conflict exists
5. Suggest next available time if possible

Work with our existing reservation fetch and validation logic.
```

---

## Troubleshooting Prompts

### If AntiGravity Seems Lost:
```
I think we've lost track of where we are in the project. Let me remind you:

We have:
- React + Vite frontend with a calendar
- JSON Server backend
- Room selector dropdown
- Ability to create/view/delete reservations
- [list any other features you've added]

We're now working on [describe what you're trying to add].
Can you help me add this feature to our existing code?
```

---

### If Changes Break Something:
```
The last change broke [describe what's broken]. Before this change, [describe what was working].

Can you fix this issue while keeping all the other features we've built intact?
Here's the error I'm seeing: [paste error message]
```

---

### To See Current State:
```
Can you show me the current complete code for App.jsx so I can verify everything we've built so far is included?
```

---

## Pro Tips for Using with AntiGravity

1. **Start each session with context:**
   ```
   We're continuing work on the room reservation app. 
   Last time we added [feature]. 
   Now I want to add [next feature].
   ```

2. **Reference previous work:**
   ```
   In the calendar we built earlier...
   Using the room selector we already have...
   Enhance the booking form we created...
   ```

3. **Be explicit about keeping existing features:**
   ```
   Add this feature but keep everything we've built so far working:
   - Room selector
   - Calendar
   - Booking form
   - Delete function
   ```

4. **Ask for incremental changes:**
   ```
   Don't rewrite everything - just add [specific feature] to what we have.
   ```

5. **Verify after each step:**
   ```
   Before we move on, let me test this. [Test and confirm it works]
   Okay, it works! Ready for the next step.
   ```

---

## Quick Reference

**Core Features (Do First):** Prompts 1-11
**Polish Features:** Prompts 12-15  
**Advanced Features:** Prompts 16-20

**Remember:** Each prompt builds on the previous one. Don't skip steps!

Good luck! 🚀