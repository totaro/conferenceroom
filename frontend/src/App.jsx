import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [rooms, setRooms] = useState([])
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
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return (
    <div className="app">
      <h1>Room Reservation System</h1>

      <div className="rooms-section">
        <h2>Available Rooms</h2>

        {loading && <p>Loading rooms...</p>}

        {error && <p className="error">Error: {error}</p>}

        {!loading && !error && rooms.length === 0 && (
          <p>No rooms available</p>
        )}

        {!loading && !error && rooms.length > 0 && (
          <ul className="rooms-list">
            {rooms.map(room => (
              <li key={room.id} className="room-item">
                <strong>{room.name}</strong>
                <span className="capacity">Capacity: {room.capacity} people</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="connection-status">
        {!loading && !error && (
          <p className="success">✅ Backend connection successful!</p>
        )}
      </div>
    </div>
  )
}

export default App

