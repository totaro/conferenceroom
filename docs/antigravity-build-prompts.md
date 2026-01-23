# AntiGravity Prompts - Room Reservation Step-by-Step

## How to Use These Prompts

1. Copy one prompt at a time
2. Paste into AntiGravity chat
3. Review the changes Claude makes
4. Test that it works
5. Move to the next prompt

---

## Phase 1: Foundation

### Prompt 1: Setup Basic Project Structure
```
I want to build a room reservation application with React + Vite on the frontend and JSON Server on the backend. 

Please help me set up the initial project structure:
1. Create a new React + Vite project in a folder called "frontend"
2. Create a backend folder with JSON Server setup
3. Give me the exact terminal commands to run
4. Create a basic db.json file with 2 rooms: "Conference Room A" (capacity 10) and "Meeting Room B" (capacity 6)
5. Show me how to start both servers

Keep it simple - I want to see both running before adding features.
```

---

### Prompt 2: Clean Up React and Test Connection
```
Now that I have the basic structure running, I need to:
1. Clean up the default Vite/React boilerplate code
2. Create a simple App.jsx with just a heading "Room Reservation System"
3. Test the connection to JSON Server by fetching the rooms
4. Display the list of rooms on the page

Keep it minimal - just prove that frontend can talk to backend.
```

---

## Phase 2: Connect Frontend to Backend

### Prompt 3: Add Room Selector Dropdown
```
I can see the list of rooms now. Next, I want to:
1. Add a dropdown/select element that shows all available rooms
2. Store the selected room in state
3. Automatically select the first room when the app loads
4. Show which room is currently selected below the dropdown

Make the dropdown look clean with some basic styling.
```

---

## Phase 3: Add Calendar

### Prompt 4: Install and Display React Big Calendar
```
I need to add a calendar component to my app. Please:
1. Install react-big-calendar and moment
2. Import and set up the calendar component
3. Display an empty calendar below my room selector
4. Make the calendar 600px high and show week view by default
5. Enable month, week, and day view options

I don't need any events on it yet - just get the calendar displaying properly.
```

---

### Prompt 5: Fetch Reservations and Display on Calendar
```
Now I need to show existing reservations on the calendar. Please:
1. Add some test reservation data to db.json (at least 2 reservations for room-1)
2. Fetch reservations from JSON Server when the selected room changes
3. Convert the reservation data to calendar event format (with start/end dates)
4. Display the events on the calendar
5. Each event should show the title and person's name

Make sure switching between rooms shows the correct reservations for each room.
```

---

## Phase 4: Add Booking Functionality

### Prompt 6: Create Booking Form Modal
```
I want to add the ability to create new reservations. Please:
1. Make the calendar selectable (users can click on time slots)
2. When a user clicks a time slot, show a modal/dialog form
3. The modal should have a simple "New Reservation" heading
4. Add a close button that works
5. Pre-fill the selected start and end times when the modal opens

Don't add the full form yet - just get the modal appearing and closing correctly.
```

---

### Prompt 7: Build Complete Booking Form
```
Now I need to complete the booking form. Please add these fields to the modal:
1. Meeting Title (required, text input)
2. Your Name (required, text input)
3. Start Time (required, datetime-local input, pre-filled from selection)
4. End Time (required, datetime-local input, pre-filled from selection)

Also add:
- Two buttons: "Book Room" (submit) and "Cancel"
- Basic styling to make the form look clean
- Form validation (all required fields must be filled)

When submitted, just console.log the data for now - don't save to database yet.
```

---

### Prompt 8: Save Reservation to Database
```
Now I need to actually save the reservation. Please:
1. Create a handleSubmit function that sends a POST request to JSON Server
2. Include all form data plus the selected roomId
3. Convert the start/end times to ISO format
4. After successful save, close the modal and refresh the calendar to show the new reservation
5. Add error handling - if save fails, show an alert to the user

Make sure the new reservation appears on the calendar immediately after booking.
```

---

## Phase 5: Polish and Improvements

### Prompt 9: Add Delete Reservation Functionality
```
I need users to be able to cancel reservations. Please:
1. Make it so when a user clicks on an existing reservation event, it triggers a delete action
2. Show a confirmation dialog "Are you sure you want to cancel this reservation?"
3. If confirmed, send a DELETE request to JSON Server
4. Refresh the calendar after successful deletion
5. Add error handling for failed deletions

The delete should work by clicking directly on calendar events.
```

---

### Prompt 10: Add More Form Fields
```
I want to collect more information in the booking form. Please add these optional fields:
1. Email (email input, optional)
2. Number of Participants (number input, optional, min 1)
3. Notes (textarea, optional, 3 rows)

Place these fields between "Your Name" and "Start Time" in the form.
Make sure all the data is saved to the database when creating a reservation.
Keep the styling consistent with existing form fields.
```

---

### Prompt 11: Add Basic Styling and Polish
```
I want to improve the overall look of the app. Please:
1. Create an index.css file with some basic styling
2. Add a nice background color to the page
3. Center the content with a max-width
4. Style the calendar events to be blue with hover effects
5. Improve the fonts and spacing throughout the app
6. Make the buttons look more polished with better colors and hover states

Keep it simple and clean - I don't want anything too fancy.
```

---

## Phase 6: Additional Enhancements (Optional)

### Prompt 12: Add Validation Before Booking
```
I need to prevent users from creating invalid reservations. Please add validation:
1. Check that end time is after start time
2. Check that the reservation is not in the past
3. Show error messages in the form if validation fails
4. Prevent form submission until all validation passes

Display validation errors clearly near the relevant form fields.
```

---

### Prompt 13: Show Reservation Details on Click
```
Instead of immediately deleting when clicking a reservation, I want to:
1. Show reservation details in a modal when clicking an event
2. Display: title, name, time, email, participants, notes
3. Add a "Delete Reservation" button in this modal
4. The delete button should ask for confirmation before deleting

This gives users a chance to see details before deciding to delete.
```

---

### Prompt 14: Add Loading States
```
I want to show loading indicators while data is being fetched. Please:
1. Add a loading state for when rooms are being fetched
2. Add a loading state for when reservations are being fetched
3. Show "Loading..." text or a simple spinner during these operations
4. Disable the room selector while loading
5. Show the calendar only after reservations have loaded

Make the loading states simple and unobtrusive.
```

---

### Prompt 15: Improve Mobile Responsiveness
```
I need the app to work better on mobile devices. Please:
1. Make the calendar responsive (adjust height on smaller screens)
2. Make the modal form responsive and scrollable on mobile
3. Ensure form inputs are properly sized for touch
4. Make the room selector dropdown touch-friendly
5. Test that all buttons are large enough for mobile

The app should be fully usable on phones and tablets.
```

---

### Prompt 16: Add Room Information Display
```
I want to show more information about each room. Please:
1. Add a "capacity" field display next to the room selector
2. Show the selected room's capacity like "Capacity: 10 people"
3. Update the db.json to include capacity for all rooms if it's not there already
4. Style this information nicely

This helps users choose the right room for their meeting size.
```

---

### Prompt 17: Add Success Notifications
```
Instead of just console.log, I want visual feedback. Please:
1. Show a success message when a reservation is created
2. Show a success message when a reservation is deleted
3. Use a simple notification that appears at the top of the page
4. Make it auto-dismiss after 3 seconds
5. Style it nicely with a green background for success

Keep the notification system simple - no external libraries needed.
```

---

### Prompt 18: Add Filter/Search for Reservations
```
I want users to be able to filter their own reservations. Please:
1. Add a "Show only my reservations" checkbox
2. Add a text input to filter by name
3. When filtering, only show matching reservations on the calendar
4. Clear filters should show all reservations again
5. Place these filters near the room selector

The filtering should happen in real-time as users type or check the box.
```

---

### Prompt 19: Add Edit Reservation Functionality
```
I need users to be able to edit existing reservations. Please:
1. When viewing reservation details, add an "Edit" button
2. The edit button should open the booking form with all fields pre-filled
3. Change the form title to "Edit Reservation" when editing
4. Submit button should say "Update Reservation" when editing
5. Send a PUT request to update the reservation in the database
6. Refresh the calendar after successful update

Make sure to handle both create and edit in the same form component.
```

---

### Prompt 20: Add Conflict Detection
```
I want to prevent double-booking. Please:
1. Before allowing a user to select a time slot, check for existing reservations
2. When the form opens, check if the selected time overlaps with any existing reservation
3. If there's a conflict, show a clear error message
4. Prevent the user from booking if there's a conflict
5. Suggest the next available time slot if possible

This should work for both new reservations and edits.
```

---

## Usage Tips

### For Each Prompt:
1. **Copy exactly as written** - These are tested to work well with AntiGravity
2. **Wait for completion** - Let Claude finish before testing
3. **Test thoroughly** - Make sure the feature works before moving on
4. **Ask follow-ups** - If something doesn't work, ask Claude to fix it
5. **Take breaks** - Don't try to do all 20 in one session!

### Recommended Order:
- **Must-have:** Prompts 1-11 (Core functionality)
- **Should-have:** Prompts 12-15 (Polish and validation)
- **Nice-to-have:** Prompts 16-20 (Advanced features)

### If Something Goes Wrong:
```
The [feature] isn't working correctly. I'm seeing [describe the problem]. 
Can you help me debug and fix this issue?
```

### To Combine Prompts:
If you want to speed up, you can combine related prompts:
```
I want to add both [feature from prompt X] and [feature from prompt Y]. 
Please implement both of these features together.
```

---

## Quick Reference

**Phase 1 (Foundation):** Prompts 1-2
**Phase 2 (Connection):** Prompt 3
**Phase 3 (Calendar):** Prompts 4-5
**Phase 4 (Booking):** Prompts 6-8
**Phase 5 (Polish):** Prompts 9-11
**Phase 6 (Advanced):** Prompts 12-20

---

## What You'll Have After All Prompts

✅ Full calendar interface
✅ Multiple rooms support
✅ Create, edit, delete reservations
✅ Detailed reservation information
✅ Conflict detection
✅ Mobile responsive
✅ Loading states
✅ Success notifications
✅ Search and filter
✅ Validation
✅ Clean, polished UI

Good luck building! 🚀