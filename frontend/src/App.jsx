import { useState, useEffect } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import './App.css'

// Setup the localizer for react-big-calendar
const localizer = momentLocalizer(moment)

function App() {
  const [rooms, setRooms] = useState([])
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState(null)

  // Form state
  const [formTitle, setFormTitle] = useState('')
  const [formName, setFormName] = useState('')
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

    fetch(`http://localhost:3001/reservations?roomId=${selectedRoom.id}`)
      .then(response => response.json())
      .then(data => {
        setReservations(data)
      })
      .catch(err => {
        console.error('Failed to fetch reservations:', err)
        setReservations([])
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
    setSelectedSlot(slotInfo)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedSlot(null)
    // Reset form
    setFormTitle('')
    setFormName('')
    setFormErrors({})
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validation
    const errors = {}
    if (!formTitle.trim()) {
      errors.title = 'Title is required'
    }
    if (!formName.trim()) {
      errors.name = 'Name is required'
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    // Log the data for now
    const reservationData = {
      title: formTitle.trim(),
      name: formName.trim(),
      roomId: selectedRoom.id,
      roomName: selectedRoom.name,
      startTime: selectedSlot.start.toISOString(),
      endTime: selectedSlot.end.toISOString()
    }

    console.log('Reservation Data:', reservationData)

    // Close modal and reset form
    handleCloseModal()
  }

  return (
    <div className="app">
      <h1>Room Reservation System</h1>

      <div className="room-selector-section">
        <h2>Select a Room</h2>

        {loading && <p>Loading rooms...</p>}

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
        <div className="calendar-section">
          <h2>Reservations for {selectedRoom.name}</h2>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 600 }}
            defaultView="week"
            selectable
            onSelectSlot={handleSelectSlot}
          />
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
              <h2>Create New Reservation</h2>
              <button className="close-button" onClick={handleCloseModal}>
                ×
              </button>
            </div>
            <div className="modal-body">
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
                      value={selectedSlot?.start.toLocaleString() || ''}
                      disabled
                      className="disabled-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>End Time</label>
                    <input
                      type="text"
                      value={selectedSlot?.end.toLocaleString() || ''}
                      disabled
                      className="disabled-input"
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-submit">
                    Book Room
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
