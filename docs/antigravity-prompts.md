# AntiGravity Prompts for Room Reservation Fixes

## Logic Error Fixes

### Prompt 1: Add Duration Validation
```
In my room reservation application (server.js), I need to add validation to prevent unrealistic reservation durations. Please update the validateReservation function to:
- Require a minimum reservation duration of 15 minutes
- Set a maximum reservation duration of 8 hours
- Add validation to prevent reservations more than 90 days in the future

Keep all existing validation logic intact.
```

### Prompt 2: Fix Race Condition
```
My server.js has a race condition issue where two concurrent POST requests to /reservations could both pass validation and create overlapping reservations. Please implement a simple locking mechanism to ensure that validation and insertion happen atomically. Use an in-memory promise-based lock since we're using in-memory storage.
```

---

## Code Quality Fixes

### Prompt 3: Add Environment Configuration
```
In my server.js file, the port number is hardcoded. Please update it to use environment variables with a fallback to 3000. Also add a comment about creating a .env file for configuration.
```

### Prompt 4: Fix File Structure Route
```
My server.js serves static files from the 'public' directory, but my index.html is in the root directory. Please add a route to serve index.html from the root path ('/') so the application works correctly.
```

### Prompt 5: Add Input Sanitization
```
In my server.js POST /reservations endpoint, I need to add input validation to ensure:
- roomId is a valid string, not empty after trimming
- roomId doesn't exceed 50 characters
- Return appropriate 400 error responses with clear messages

Keep the existing validation logic.
```

### Prompt 6: Remove Global Functions
```
In my index.html, the deleteReservation function is defined globally and called via onclick attributes. Please refactor this to use event delegation instead. Add an event listener to the listDiv that handles clicks on cancel buttons, and update the renderList function to use data attributes instead of inline onclick.
```

### Prompt 7: Consolidate Error Display
```
In my index.html, error handling is inconsistent - some errors use alert() and others use the errorDisplay div. Please update all error handling to use a single, consistent approach. Use the errorDisplay div for form submission errors and show a temporary notification for deletion success/failure instead of alerts.
```

---

## Error Handling Fixes

### Prompt 8: Improve Fetch Error Handling
```
In my index.html, the fetchReservations function catches errors but only logs them to console. Please update it to:
- Check if the response is ok before parsing JSON
- Show a user-friendly error message in the listDiv when fetching fails
- Include the error in the console log for debugging
```

### Prompt 9: Better Error Messages in Delete
```
In my index.html, the deleteReservation function shows generic error messages. Please improve it to:
- Distinguish between network errors and server errors
- Show more specific error messages to users
- Keep the confirmation dialog but improve the success/error feedback
```

### Prompt 10: Add Response Status Checks
```
In my index.html form submission handler, please add proper response status checking before trying to parse JSON, and provide more specific error messages based on the type of error (network error vs server error vs validation error).
```

---

## Structure Improvements

### Prompt 11: Add Request Logging Middleware
```
In my server.js, please add a simple logging middleware that logs each incoming request with:
- Timestamp (ISO format)
- HTTP method
- Request path

Place it before the route definitions.
```

### Prompt 12: Separate JavaScript from HTML
```
In my index.html, all JavaScript is in a <script> tag. Please extract it to a separate file called 'app.js' and update the HTML to reference it. Make sure the script is loaded with defer attribute.
```

### Prompt 13: Add Loading Indicators
```
In my index.html, please add loading state indicators:
- Show "Loading..." in the reservations list while fetching
- Disable the submit button and show "Reserving..." while creating a reservation
- Re-enable the button after the request completes
```

### Prompt 14: Improve Error Response Structure
```
In my server.js, please standardize all error responses to return consistent JSON objects with an 'error' field. Also add a 500 error handler middleware at the end to catch any unhandled errors and return a proper JSON response.
```

---

## Additional Enhancement Prompts

### Prompt 15: Add Success Notifications
```
In my index.html, please add a reusable notification system that shows temporary success/error messages at the top of the page instead of using alert(). Messages should auto-dismiss after 3 seconds and be styled appropriately (green for success, red for error).
```

### Prompt 16: Add Form Validation
```
In my index.html reservation form, please add client-side validation before submission:
- Check that end time is after start time
- Check that start time is in the future
- Show validation errors in the errorDisplay div
- Prevent form submission if validation fails
```

### Prompt 17: Add Comments and Documentation
```
In my server.js, please add JSDoc-style comments to:
- The validateReservation function explaining each validation rule
- Each API endpoint explaining parameters, responses, and status codes
- Add inline comments for complex logic
```

### Prompt 18: Improve Date Display
```
In my index.html renderList function, please improve the date formatting to:
- Show dates in a more readable format (e.g., "Jan 22, 2026 at 2:30 PM")
- Add the day of the week
- Use a consistent locale-aware format
```

---

## Usage Instructions

1. **Copy one prompt at a time** and paste it into AntiGravity
2. **Review the changes** that Claude makes
3. **Test the functionality** to ensure it works correctly
4. **Move to the next prompt** once you're satisfied

## Recommended Order

For best results, apply the fixes in this order:

**Critical fixes first:**
1. Prompt 2 (Race condition)
2. Prompt 1 (Duration validation)
3. Prompt 4 (File structure)

**Code quality improvements:**
4. Prompt 5 (Input sanitization)
5. Prompt 3 (Environment config)
6. Prompt 11 (Logging)

**Error handling:**
7. Prompt 8 (Fetch error handling)
8. Prompt 9 (Delete errors)
9. Prompt 10 (Form error handling)

**Structure and UX:**
10. Prompt 6 (Remove globals)
11. Prompt 7 (Consolidate errors)
12. Prompt 13 (Loading indicators)
13. Prompt 15 (Success notifications)

**Polish:**
14. Prompt 16 (Form validation)
15. Prompt 18 (Date display)
16. Prompt 12 (Separate JS)
17. Prompt 17 (Documentation)
18. Prompt 14 (Error structure)

---

## Tips for Using These Prompts

- **Be specific**: If AntiGravity's solution doesn't match your needs, add more details
- **Test incrementally**: Don't apply all changes at once
- **Keep backups**: Save working versions before major changes
- **Combine prompts**: If related, you can combine 2-3 prompts into one request
- **Ask for explanation**: Add "Please explain the changes" to understand what was modified