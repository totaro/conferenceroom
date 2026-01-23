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
          />
        </div>
      )}

      <div className="connection-status">
        {!loading && !error && (
          <p className="success">✅ Backend connection successful!</p>
        )}
      </div>
    </div>
  )
}

export default App
