# Calendar Integration - Quick Reference

## What Was Added

### Packages
- `react-big-calendar` - Calendar UI component
- `moment` - Date handling library

### Visual Changes
1. **New Section**: Calendar appears below room selector
2. **Heading**: "Reservations for [Room Name]"
3. **Calendar View**: Week view at 600px height
4. **Time Grid**: Shows hours vertically, days horizontally
5. **Empty State**: Ready to display reservation events

### Code Structure

```jsx
// Imports
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'

// Setup localizer
const localizer = momentLocalizer(moment)

// In component
<Calendar
  localizer={localizer}
  events={[]}              // Empty for now
  startAccessor="start"     // Event start time property
  endAccessor="end"         // Event end time property
  style={{ height: 600 }}   // Fixed height
  defaultView="week"        // Week view by default
/>
```

### User Flow
1. Page loads → Rooms fetched → First room auto-selected
2. Calendar displays for selected room
3. User can change room → Calendar heading updates
4. Calendar ready to show reservation events

### What's Next
- Fetch reservations from backend
- Display reservations as calendar events
- Add click handlers for creating new reservations
