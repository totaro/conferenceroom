import { useState, useEffect } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import './App.css'

import 'moment/locale/en-gb'

// Setup the localizer for react-big-calendar
moment.locale('en-gb')
const localizer = momentLocalizer(moment)

function App() {
  const [rooms, setRooms] = useState([])
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [reservationsLoading, setReservationsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [isEditing, setIsEditing] = useState(false)

  // Notification state
  const [notification, setNotification] = useState(null)

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  // Event details modal state
  // Event details modal state
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Calendar state
  const [view, setView] = useState('week')
  // Default to Jan 24, 2026 to match test data
  const [date, setDate] = useState(new Date(2026, 0, 24))

  // Form state
  const [formTitle, setFormTitle] = useState('')
  const [formName, setFormName] = useState('')
  const [formEmail, setFormEmail] = useState('')
  const [formParticipants, setFormParticipants] = useState('')
  const [formNotes, setFormNotes] = useState('')
  const [formEndTime, setFormEndTime] = useState(null)
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    // Fetch rooms from JSON Server
    fetch('http://localhost:3001/rooms')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch rooms')
        }
        return response.json()
      })
      .then(data => {
        setRooms(data)
        // Auto-select the first room when data loads
        if (data.length > 0) {
          setSelectedRoom(data[0])
        }
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  // Fetch reservations whenever selected room changes
  useEffect(() => {
    if (!selectedRoom) return

    setReservationsLoading(true)
    fetch(`http://localhost:3001/reservations?roomId=${selectedRoom.id}`)
      .then(response => response.json())
      .then(data => {
        setReservations(data)
        setReservationsLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch reservations:', err)
        setReservations([])
        setReservationsLoading(false)
        showNotification('Failed to load reservations', 'error')
      })
  }, [selectedRoom])

  const handleRoomChange = (event) => {
    const roomId = event.target.value
    const room = rooms.find(r => r.id === roomId)
    setSelectedRoom(room)
  }

  // Transform reservations to calendar event format
  const events = reservations.map(reservation => ({
    id: reservation.id,
    title: reservation.title,
    start: new Date(reservation.startTime),
    end: new Date(reservation.endTime),
    resource: reservation
  }))

  // Handle time slot selection on calendar
  const handleSelectSlot = (slotInfo) => {
    // Prevent booking in the past
    const now = new Date()
    if (slotInfo.start < now) {
      showNotification("You cannot book a reservation in the past.", 'error')
      return
    }

    setSelectedSlot(slotInfo)
    setFormEndTime(slotInfo.end) // Initialize editable end time
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedSlot(null)
    // Reset form
    setFormTitle('')
    setFormName('')
    setFormEmail('')
    setFormParticipants('')
    setFormNotes('')
    setFormEndTime(null)
    setFormErrors({})
    setIsEditing(false)
  }

  // Clear specific errors when user changes the problematic field
  useEffect(() => {
    if (formErrors.endTime || formErrors.participants) {
      const newErrors = { ...formErrors }

      // Clear end time error if user changes the end time
      if (formErrors.endTime && formEndTime && selectedSlot) {
        const newStart = new Date(selectedSlot.start)
        const newEnd = new Date(formEndTime)

        // Check if end time is now valid (after start time)
        if (newEnd > newStart) {
          // Also check if it no longer overlaps
          const hasOverlap = reservations.some(reservation => {
            // Skip self if editing
            if (isEditing && selectedEvent && reservation.id === selectedEvent.id) {
              return false
            }

            const existingStart = new Date(reservation.startTime)
            const existingEnd = new Date(reservation.endTime)
            return newStart < existingEnd && newEnd > existingStart
          })

          if (!hasOverlap) {
            delete newErrors.endTime
          }
        }
      }

      // Clear participants error if user changes participants to valid number
      if (formErrors.participants && formParticipants && selectedRoom) {
        const participantCount = parseInt(formParticipants)
        if (participantCount <= selectedRoom.capacity) {
          delete newErrors.participants
        }
      }

      setFormErrors(newErrors)
    }
  }, [formEndTime, formParticipants])


  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
    const errors = {}
    if (!formTitle.trim()) {
      errors.title = 'Title is required'
    }
    if (!formName.trim()) {
      errors.name = 'Name is required'
    }

    // Validate participants don't exceed room capacity
    if (formParticipants && selectedRoom) {
      const participantCount = parseInt(formParticipants)
      if (participantCount > selectedRoom.capacity) {
        errors.participants = `Room capacity is ${selectedRoom.capacity}. You entered ${participantCount} participants.`
      }
    }

    // Validate start time is not in the past
    const now = new Date()
    if (selectedSlot && new Date(selectedSlot.start) < now) {
      errors.general = 'Cannot book a reservation in the past'
    }

    // Validate end time is after start time
    if (formEndTime && selectedSlot) {
      const endTime = new Date(formEndTime)
      const startTime = new Date(selectedSlot.start)
      if (endTime <= startTime) {
        errors.endTime = 'End time must be after start time'
      }
    }

    // Check for overlapping reservations
    if (selectedSlot && formEndTime) {
      const newStart = new Date(selectedSlot.start)
      const newEnd = new Date(formEndTime)

      const hasOverlap = reservations.some(reservation => {
        // Skip self if editing
        if (isEditing && selectedEvent && reservation.id === selectedEvent.id) {
          return false
        }

        const existingStart = new Date(reservation.startTime)
        const existingEnd = new Date(reservation.endTime)

        // Check if time ranges overlap
        // Overlap occurs if: new start is before existing end AND new end is after existing start
        return newStart < existingEnd && newEnd > existingStart
      })

      if (hasOverlap) {
        errors.endTime = 'This time slot overlaps with an existing reservation. Please choose a different time.'
      }
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    // Prepare reservation data for backend
    const reservationData = {
      roomId: selectedRoom.id,
      title: formTitle.trim(),
      name: formName.trim(),
      startTime: selectedSlot.start.toISOString(),
      endTime: formEndTime ? new Date(formEndTime).toISOString() : selectedSlot.end.toISOString(),
      // Optional fields
      email: formEmail.trim() || undefined,
      participants: formParticipants ? parseInt(formParticipants) : undefined,
      notes: formNotes.trim() || undefined
    }

    try {
      // Determine method and URL based on edit mode
      const url = isEditing
        ? `http://localhost:3001/reservations/${selectedEvent.id}`
        : 'http://localhost:3001/reservations'

      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reservationData)
      })

      if (!response.ok) {
        throw new Error(`Failed to ${isEditing ? 'update' : 'create'} reservation`)
      }

      const savedReservation = await response.json()
      console.log(`Reservation ${isEditing ? 'updated' : 'created'}:`, savedReservation)

      // Close modal and reset form
      handleCloseModal()

      // Refresh calendar
      const reservationsResponse = await fetch(`http://localhost:3001/reservations?roomId=${selectedRoom.id}`)
      const updatedReservations = await reservationsResponse.json()
      setReservations(updatedReservations)

      showNotification(`✅ Reservation ${isEditing ? 'updated' : 'created'} successfully!`)

    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} reservation:`, error)
      showNotification(`❌ Failed to ${isEditing ? 'update' : 'create'} reservation. Please try again.`, 'error')
    }
  }

  // Open form in edit mode
  const handleEditEvent = () => {
    if (!selectedEvent) return

    // Pre-fill form
    setFormTitle(selectedEvent.title)
    setFormName(selectedEvent.resource.name || '')
    setFormEmail(selectedEvent.resource.email || '')
    setFormParticipants(selectedEvent.resource.participants || '')
    setFormNotes(selectedEvent.resource.notes || '')

    // Set time slots
    const start = new Date(selectedEvent.start)
    const end = new Date(selectedEvent.end)

    setSelectedSlot({
      start: start,
      end: end
    })
    setFormEndTime(end)

    setIsEditing(true)
    setIsDetailsModalOpen(false) // Close details
    setIsModalOpen(true) // Open form
  }

  // Open details modal when an event is clicked
  const handleSelectEvent = (event) => {
    setSelectedEvent(event)
    setIsDetailsModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedEvent) return

    try {
      // DELETE from JSON Server
      const response = await fetch(`http://localhost:3001/reservations/${selectedEvent.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete reservation')
      }

      console.log('Reservation deleted:', selectedEvent.id)

      // Refresh calendar to remove deleted reservation
      const reservationsResponse = await fetch(`http://localhost:3001/reservations?roomId=${selectedRoom.id}`)
      const updatedReservations = await reservationsResponse.json()
      setReservations(updatedReservations)

      // Close modals
      setShowDeleteConfirm(false)
      setIsDetailsModalOpen(false)
      setSelectedEvent(null)

      showNotification('✅ Reservation cancelled successfully!')

    } catch (error) {
      console.error('Error deleting reservation:', error)
      showNotification('❌ Failed to cancel reservation. Please try again.', 'error')
    }
  }

  return (
    <div className="app">
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <h1>Room Reservation System</h1>

      <div className="room-selector-section">
        <h2>Select a Room</h2>

        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading rooms...</p>
          </div>
        )}

        {error && <p className="error">Error: {error}</p>}

        {!loading && !error && rooms.length === 0 && (
          <p>No rooms available</p>
        )}

        {!loading && !error && rooms.length > 0 && (
          <>
            <select
              className="room-dropdown"
              value={selectedRoom?.id || ''}
              onChange={handleRoomChange}
              disabled={loading}
            >
              {rooms.map(room => (
                <option key={room.id} value={room.id}>
                  {room.name} (Capacity: {room.capacity})
                </option>
              ))}
            </select>

            {selectedRoom && (
              <div className="selected-room-info">
                <h3>Currently Selected:</h3>
                <div className="room-details">
                  <p><strong>Room:</strong> {selectedRoom.name}</p>
                  <p><strong>Capacity:</strong> {selectedRoom.capacity} people</p>
                  <p><strong>Room ID:</strong> {selectedRoom.id}</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Calendar Section */}
      {selectedRoom && (
        <div className="calendar-section" style={{ position: 'relative' }}>
          {reservationsLoading && (
            <div className="loading-overlay" style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(255, 255, 255, 0.8)',
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 'var(--radius-lg)'
            }}>
              <div className="spinner" style={{ borderTopColor: 'var(--primary-blue)' }}></div>
              <p style={{ marginTop: '1rem', color: 'var(--gray-600)', fontWeight: 500 }}>Loading reservations...</p>
            </div>
          )}
          <h2>Reservations for {selectedRoom.name}</h2>
          <Calendar
            localizer={localizer}
            culture="en-gb"
            events={events}
            startAccessor="start"
            endAccessor="end"

            style={{ height: 600 }}
            className="rbc-calendar"
            // Controlled props
            view={view}
            date={date}
            onView={(newView) => setView(newView)}
            onNavigate={(newDate) => setDate(newDate)}
            //
            selectable
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            formats={{
              timeGutterFormat: 'HH:mm',
              eventTimeRangeFormat: ({ start, end }, culture, local) =>
                local.format(start, 'HH:mm', culture) + ' - ' +
                local.format(end, 'HH:mm', culture),
              agendaTimeRangeFormat: ({ start, end }, culture, local) =>
                local.format(start, 'HH:mm', culture) + ' - ' +
                local.format(end, 'HH:mm', culture),
              dayHeaderFormat: 'dddd DD/MM',
              dayRangeHeaderFormat: ({ start, end }, culture, local) =>
                local.format(start, 'DD/MM/YYYY', culture) + ' - ' +
                local.format(end, 'DD/MM/YYYY', culture),
            }}
          />
          <p className="calendar-hint">
            💡 <strong>Tip:</strong> Click or drag across time slots to select your booking duration. You can also adjust the end time in the booking form.
          </p>
        </div>
      )}

      <div className="connection-status">
        {!loading && !error && (
          <p className="success">✅ Backend connection successful!</p>
        )}
      </div>

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>{isEditing ? 'Edit Reservation' : 'Create New Reservation'}</h2>
                <p className="modal-subtitle">
                  {selectedRoom?.name} • Capacity: {selectedRoom?.capacity} people
                </p>
              </div>
              <button className="close-button" onClick={handleCloseModal}>
                ×
              </button>
            </div>
            <div className="modal-body">
              {formErrors.general && (
                <div className="form-global-error">
                  ⚠️ {formErrors.general}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="title">Title *</label>
                  <input
                    type="text"
                    id="title"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className={formErrors.title ? 'error-input' : ''}
                    placeholder="e.g., Team Meeting"
                  />
                  {formErrors.title && (
                    <span className="error-message">{formErrors.title}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="name">Name *</label>
                  <input
                    type="text"
                    id="name"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className={formErrors.name ? 'error-input' : ''}
                    placeholder="Your name"
                  />
                  {formErrors.name && (
                    <span className="error-message">{formErrors.name}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="your.email@example.com (optional)"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="participants">Number of Participants</label>
                  <input
                    type="number"
                    id="participants"
                    value={formParticipants}
                    onChange={(e) => setFormParticipants(e.target.value)}
                    placeholder={`Max ${selectedRoom?.capacity || '?'} people (optional)`}
                    min="1"
                    max={selectedRoom?.capacity}
                    className={formErrors.participants ? 'error-input' : ''}
                  />
                  {formErrors.participants && (
                    <span className="error-message">{formErrors.participants}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="notes">Notes</label>
                  <textarea
                    id="notes"
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    placeholder="Additional information (optional)"
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label>Room</label>
                  <input
                    type="text"
                    value={selectedRoom?.name || ''}
                    disabled
                    className="disabled-input"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Start Time</label>
                    <input
                      type="text"
                      value={selectedSlot ? moment(selectedSlot.start).format('DD/MM/YYYY HH:mm') : ''}
                      disabled
                      className="disabled-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="endTime">End Time *</label>
                    <input
                      type="datetime-local"
                      id="endTime"
                      value={formEndTime ? new Date(formEndTime.getTime() - formEndTime.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ''}
                      onChange={(e) => setFormEndTime(new Date(e.target.value))}
                      className={formErrors.endTime ? 'error-input' : ''}
                    />
                    {formErrors.endTime && (
                      <span className="error-message">{formErrors.endTime}</span>
                    )}
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-submit">
                    {isEditing ? 'Update Reservation' : 'Book Room'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Event Details Modal */}
      {isDetailsModalOpen && selectedEvent && (
        <div className="modal-overlay" onClick={() => setIsDetailsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Reservation Details</h2>
              <button
                className="close-button"
                onClick={() => setIsDetailsModalOpen(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="details-grid">
                <div className="detail-item">
                  <h3>Title</h3>
                  <p>{selectedEvent.title}</p>
                </div>

                <div className="detail-item">
                  <h3>Reserved By</h3>
                  <p>{selectedEvent.resource.name || 'N/A'}</p>
                </div>

                <div className="detail-item">
                  <h3>Time</h3>
                  <p>
                    {moment(selectedEvent.start).format('DD/MM/YYYY HH:mm')} - <br />
                    {moment(selectedEvent.end).format('HH:mm')}
                  </p>
                </div>

                <div className="detail-item">
                  <h3>Room</h3>
                  <p>{selectedRoom?.name}</p>
                </div>

                {selectedEvent.resource.email && (
                  <div className="detail-item">
                    <h3>Email</h3>
                    <p>{selectedEvent.resource.email}</p>
                  </div>
                )}

                {selectedEvent.resource.participants && (
                  <div className="detail-item">
                    <h3>Participants</h3>
                    <p>{selectedEvent.resource.participants}</p>
                  </div>
                )}

                {selectedEvent.resource.notes && (
                  <div className="detail-item full-width">
                    <h3>Notes</h3>
                    <p style={{ whiteSpace: 'pre-wrap' }}>{selectedEvent.resource.notes}</p>
                  </div>
                )}
              </div>

              <div className="form-actions" style={{ marginTop: '2rem' }}>
                <button
                  className="btn-cancel"
                  onClick={handleEditEvent}
                  style={{ marginRight: 'auto', borderColor: 'var(--primary-blue)', color: 'var(--primary-blue)' }}
                >
                  Edit
                </button>
                <button
                  className="btn-cancel"
                  onClick={() => setIsDetailsModalOpen(false)}
                >
                  Close
                </button>
                <button
                  className="btn-submit"
                  style={{ background: 'var(--error)', borderColor: 'var(--error)' }}
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  Cancel Reservation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay" style={{ zIndex: 2000 }}>
          <div className="modal-content" style={{ maxWidth: '400px', textAlign: 'center' }}>
            <div className="modal-body">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
              <h2 style={{ color: 'var(--gray-900)', marginBottom: '0.5rem' }}>Are you sure?</h2>
              <p style={{ color: 'var(--gray-600)', marginBottom: '2rem' }}>
                Do you really want to delete this reservation? This action cannot be undone.
              </p>

              <div className="form-actions" style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <button
                  className="btn-cancel"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Keep Reservation
                </button>
                <button
                  className="btn-submit"
                  style={{ background: 'var(--error)', borderColor: 'var(--error)' }}
                  onClick={handleConfirmDelete}
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
