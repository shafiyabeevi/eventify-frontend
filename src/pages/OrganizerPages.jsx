import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getErrorMessage } from '../services/api.js'
import { createEvent, deleteEvent, getEvent, getOrganizerEvents, getOrganizerEventStatistics, updateEvent } from '../services/eventService.js'
import { formatEventDate } from '../components/EventCard.jsx'

function EventPerformanceMetrics({ statistics }) {
  const totalTickets = Number(statistics.totalTickets || 0)
  const totalRevenue = Number(statistics.totalRevenue || 0)

  return (
    <>
      <div className="event-performance-stats">
        <div className="performance-stat tickets-stat"><span aria-hidden="true">▤</span><div><strong>{totalTickets.toLocaleString('en-IN')}</strong><small>Tickets booked</small></div></div>
        <div className="performance-stat revenue-stat"><span aria-hidden="true">₹</span><div><strong>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(totalRevenue)}</strong><small>Total revenue</small></div></div>
      </div>
      {totalTickets === 0 && <p className="no-bookings-note">No bookings yet</p>}
    </>
  )
}

function EventPerformanceSummary({ statistics }) {
  return (
    <section className="event-performance" aria-label="Event performance">
      <h3>Event Performance</h3>
      {statistics ? <EventPerformanceMetrics statistics={statistics} /> : <p className="performance-unavailable">No verified owner link exists for this older event, so its statistics are withheld.</p>}
    </section>
  )
}

export function OrganizerHomePage() {
  const [events, setEvents] = useState([])
  const [statistics, setStatistics] = useState([])
  const [error, setError] = useState('')
  const [statisticsError, setStatisticsError] = useState('')
  const [statisticsLoading, setStatisticsLoading] = useState(true)
  const totalTickets = statistics.reduce((total, item) => total + Number(item.totalTickets || 0), 0)
  const totalRevenue = statistics.reduce((total, item) => total + Number(item.totalRevenue || 0), 0)
  const totalsUnavailable = statisticsLoading || Boolean(statisticsError) || (statistics.length === 0 && events.length > 0)
  const formattedRevenue = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(totalRevenue)

  useEffect(() => {
    getOrganizerEvents().then(setEvents).catch((requestError) => setError(getErrorMessage(requestError)))
    getOrganizerEventStatistics().then(setStatistics).catch((requestError) => setStatisticsError(getErrorMessage(requestError))).finally(() => setStatisticsLoading(false))
  }, [])

  return (
    <main className="page-shell dashboard-page organizer-home">
      <div className="organizer-welcome"><div><p className="eyebrow">EVENTIFY / ORGANIZER DESK</p><h1>Welcome to your<br /><em>event studio.</em></h1><p className="dashboard-copy">Shape the calendar and bring your next gathering to life.</p></div><Link className="button button-dark" to="/organizer/events/create"><span aria-hidden="true">＋</span> Create Event</Link></div>
      <section className="organizer-stat-grid" aria-label="Event overview">
        <article className="organizer-stat"><span className="stat-icon">▤</span><p>Total events</p><strong>{events.length}</strong><small>In the event catalog</small></article>
        <article className="organizer-stat organizer-ticket-total"><span className="stat-icon">▤</span><p>Total Tickets</p><strong>{totalsUnavailable ? '—' : totalTickets.toLocaleString('en-IN')}</strong><small>Across your events</small></article>
        <article className="organizer-stat organizer-revenue-total"><span className="stat-icon">₹</span><p>Total Revenue</p><strong>{totalsUnavailable ? '—' : formattedRevenue}</strong><small>Across your events</small></article>
        <Link className="organizer-stat organizer-stat-link" to="/organizer/events">Manage events <span aria-hidden="true">→</span><small>Review, edit, or remove listings</small></Link>
      </section>
      <section className="organizer-performance-section">
        <div className="organizer-performance-heading"><p className="eyebrow">REAL BOOKING TOTALS</p><h2>Event performance</h2></div>
        {statisticsError && <p className="form-message error-message">Could not load event performance: {statisticsError}</p>}
        {statisticsLoading ? <p className="state-message">Loading performance…</p> : statistics.length === 0 ? <div className="performance-empty">{events.length > 0 ? 'Performance is withheld for older events without a verified organizer link.' : 'Create an event to start tracking performance.'}</div> : (
          <div className="organizer-performance-grid">{statistics.map((item) => (
            <article className="organizer-performance-card" key={item.eventId}>
              <div className="organizer-performance-card-heading"><span>EVENT SUMMARY</span><h3>{item.eventName}</h3></div>
              <EventPerformanceMetrics statistics={item} />
            </article>
          ))}</div>
        )}
      </section>
      {error && <p className="form-message error-message">Could not load events: {error}</p>}
    </main>
  )
}

export function OrganizerEventsPage() {
  const [events, setEvents] = useState([])
  const [statistics, setStatistics] = useState([])
  const [error, setError] = useState('')
  const [statisticsError, setStatisticsError] = useState('')
  const [loading, setLoading] = useState(true)
  const [statisticsLoading, setStatisticsLoading] = useState(true)

  useEffect(() => {
    getOrganizerEvents().then(setEvents).catch((requestError) => setError(getErrorMessage(requestError))).finally(() => setLoading(false))
    getOrganizerEventStatistics().then(setStatistics).catch((requestError) => setStatisticsError(getErrorMessage(requestError))).finally(() => setStatisticsLoading(false))
  }, [])

  const statisticsByEventId = new Map(statistics.map((item) => [String(item.eventId), item]))

  async function handleDelete(event) {
    if (!window.confirm(`Delete “${event.eventName}”? This cannot be undone.`)) return
    try {
      await deleteEvent(event.id)
      setEvents((current) => current.filter((item) => item.id !== event.id))
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    }
  }

  return (
    <main className="page-shell dashboard-page">
      <div className="section-heading"><div><p className="eyebrow">ORGANIZER DESK</p><h1>Event catalog</h1></div><Link className="button button-dark" to="/organizer/events/create"><span aria-hidden="true">＋</span> Create Event</Link></div>
      <p className="local-note">The backend exposes organizer-wide event editing rather than organizer-owned event lists.</p>
      {error && <p className="form-message error-message">{error}</p>}
      {statisticsError && <p className="form-message error-message">Could not load event performance: {statisticsError}</p>}
      {loading || statisticsLoading ? <p className="state-message">Loading events and performance…</p> : events.length === 0 ? <div className="empty-state"><span>✳</span><h3>No events yet.</h3><p>Create the first event and give people a reason to gather.</p></div> : (
        <div className="manage-list">{events.map((event) => (
          <article className="manage-row" key={event.id}>
            <div className="manage-date"><strong>{event.eventDate ? new Date(event.eventDate).getDate() : '—'}</strong><span>{formatEventDate(event.eventDate)}</span></div>
            <div className="manage-title"><h2>{event.eventName}</h2><p>{event.organizerName || 'Event organizer'} · ${Number(event.ticketPrice || 0).toFixed(2)} / ticket</p></div>
            <EventPerformanceSummary statistics={statisticsByEventId.get(String(event.id))} />
            <Link className="text-action" to={`/organizer/events/${event.id}/edit`}>Edit</Link>
            <button className="text-action danger-action" onClick={() => handleDelete(event)}>Delete</button>
          </article>
        ))}</div>
      )}
    </main>
  )
}

const emptyForm = { eventName: '', eventDate: '', ticketPrice: '', contactNumber: '', organizerName: '', eventDescription: '' }

export function EventFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!id) return
    getEvent(id).then((event) => setForm({
      eventName: event.eventName || '',
      eventDate: event.eventDate || '',
      ticketPrice: event.ticketPrice ?? '',
      contactNumber: event.contactNumber || '',
      organizerName: event.organizerName || '',
      eventDescription: event.eventDescription || '',
    })).catch((requestError) => setError(getErrorMessage(requestError)))
  }, [id])

  async function handleSubmit(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    const payload = { ...form, ticketPrice: Number(form.ticketPrice) }
    try {
      if (id) await updateEvent(id, payload)
      else await createEvent(payload)
      navigate('/organizer/events')
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="page-shell form-page">
      <Link className="back-link" to="/organizer/events">← Event catalog</Link>
      <div className="form-page-heading"><p className="eyebrow">ORGANIZER DESK</p><h1>{id ? 'Shape the details.' : 'Put it on the calendar.'}</h1></div>
      <form className="event-form form-stack" onSubmit={handleSubmit}>
        <label>Event name<input required value={form.eventName} onChange={(event) => setForm({ ...form, eventName: event.target.value })} /></label>
        <label className="event-description-field">Event description
          <textarea
            rows="6"
            placeholder="Describe your event, activities, highlights, and other important details..."
            value={form.eventDescription}
            onChange={(event) => setForm({ ...form, eventDescription: event.target.value })}
          />
          <span>Share the details that will help guests know what to expect.</span>
        </label>
        <div className="form-row">
          <label>Event date<input type="date" required value={form.eventDate} onChange={(event) => setForm({ ...form, eventDate: event.target.value })} /></label>
          <label>Ticket price<input type="number" min="0" step="0.01" required value={form.ticketPrice} onChange={(event) => setForm({ ...form, ticketPrice: event.target.value })} /></label>
        </div>
        <div className="form-row">
          <label>Organizer name<input required value={form.organizerName} onChange={(event) => setForm({ ...form, organizerName: event.target.value })} /></label>
          <label>Contact number<input required value={form.contactNumber} onChange={(event) => setForm({ ...form, contactNumber: event.target.value })} /></label>
        </div>
        {error && <p className="form-message error-message" role="alert">{error}</p>}
        <button className="button button-dark button-wide" disabled={busy}>{busy ? 'Saving…' : id ? 'Save changes' : 'Publish event'} <span aria-hidden="true">→</span></button>
      </form>
    </main>
  )
}