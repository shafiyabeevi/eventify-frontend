import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { formatEventDate } from '../components/EventCard.jsx'
import { bookTickets, getEvent, saveReceipt } from '../services/eventService.js'
import { getErrorMessage } from '../services/api.js'

export default function EventDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const [event, setEvent] = useState(null)
  const [count, setCount] = useState(1)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    getEvent(id).then(setEvent).catch((requestError) => setError(getErrorMessage(requestError))).finally(() => setLoading(false))
  }, [id])

  async function handleBooking() {
    setBusy(true)
    setError('')
    setMessage('')
    try {
      const result = await bookTickets(event.id, Number(count))
      if (typeof result === 'string' && /not found|failed|error/i.test(result)) throw new Error(result)
      saveReceipt({
        receiptKey: `${Date.now()}`,
        eventId: event.id,
        eventName: event.eventName,
        eventDate: event.eventDate,
        numberOfTickets: Number(count),
        totalAmount: Number(event.ticketPrice) * Number(count),
        confirmation: typeof result === 'string' ? result : 'Booking successful',
        savedAt: new Date().toISOString(),
      }, user.email)
      setMessage('Your booking is confirmed.')
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setBusy(false)
    }
  }

  if (loading) return <main className="page-shell"><p className="state-message">Loading event…</p></main>
  if (error && !event) return <main className="page-shell"><p className="state-message error-message">{error}</p><Link to="/events">Back to events</Link></main>
  if (!event) return null

  return (
    <main className="page-shell detail-page">
      <Link className="back-link" to="/events">← All events</Link>
      <div className="detail-layout">
        <section className="detail-main">
          <div className="detail-art"><p className="eyebrow">EVENTIFY PRESENTS</p><h1>{event.eventName}</h1><span className="detail-art-mark">✳</span></div>
          <p className="eyebrow detail-label">THE DETAILS</p>
          <dl className="event-facts">
            <div><dt>When</dt><dd>{formatEventDate(event.eventDate)}</dd></div>
            <div><dt>Hosted by</dt><dd>{event.organizerName || 'Event organizer'}</dd></div>
            <div><dt>Contact</dt><dd>{event.contactNumber || 'Contact details unavailable'}</dd></div>
          </dl>
          {event.eventDescription && <section className="event-description-view">
            <p className="eyebrow">ABOUT THE EVENT</p>
            <p>{event.eventDescription}</p>
          </section>}
        </section>
        <aside className="booking-panel">
          <p className="eyebrow">SAVE YOUR SPOT</p>
          <p className="detail-price">${Number(event.ticketPrice || 0).toFixed(2)} <span>/ ticket</span></p>
          {user?.role === 'CUSTOMER' ? <>
            <label className="ticket-count">Tickets<input type="number" min="1" max="12" value={count} onChange={(change) => setCount(Math.max(1, Math.min(12, Number(change.target.value))))} /></label>
            <p className="total-line"><span>Total</span><strong>${(Number(event.ticketPrice || 0) * count).toFixed(2)}</strong></p>
            {error && <p className="form-message error-message" role="alert">{error}</p>}
            {message && <p className="form-message success-message booking-success" role="status">{message} <Link to="/customer/bookings">View receipt</Link></p>}
            <button className="button button-dark button-wide" disabled={busy} onClick={handleBooking}>{busy ? 'Booking…' : 'Book tickets'} <span aria-hidden="true">→</span></button>
          </> : user ? <p className="muted">Ticket booking is available to customer accounts.</p> : <p className="muted"><Link to="/login">Sign in as a customer</Link> to book tickets.</p>}
          <p className="booking-note">Your booking is confirmed by the Eventify booking service.</p>
        </aside>
      </div>
    </main>
  )
}