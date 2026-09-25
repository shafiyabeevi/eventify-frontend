import { useEffect, useState } from 'react'
import EventCard from '../components/EventCard.jsx'
import { getEvents } from '../services/eventService.js'
import { getErrorMessage } from '../services/api.js'

export default function EventsPage() {
  const [events, setEvents] = useState([])
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getEvents().then(setEvents).catch((requestError) => setError(getErrorMessage(requestError))).finally(() => setLoading(false))
  }, [])

  const visibleEvents = events.filter((event) => `${event.eventName} ${event.organizerName}`.toLowerCase().includes(search.toLowerCase()))

  return (
    <main className="page-shell">
      <section className="events-hero">
        <div><p className="eyebrow">LIFE HAPPENS IN PERSON</p><h1>Make a date<br /><em>with the moment.</em></h1></div>
        <p className="hero-copy">Small rooms, big stages, new faces. Find something worth stepping out for.</p>
        <span className="hero-ornament" aria-hidden="true">✳</span>
      </section>
      <section className="catalog-section">
        <div className="section-heading">
          <div><p className="eyebrow">THE EVENT BOARD</p><h2>Coming up</h2></div>
          <label className="search-box"><span aria-hidden="true">⌕</span><input aria-label="Search events" placeholder="Search events or hosts" value={search} onChange={(event) => setSearch(event.target.value)} /></label>
        </div>
        {loading && <p className="state-message">Finding events…</p>}
        {error && <div className="state-message error-message">Could not load events: {error}</div>}
        {!loading && !error && visibleEvents.length === 0 && <div className="empty-state"><span>✳</span><h3>{search ? 'No matches yet.' : 'The calendar is open.'}</h3><p>{search ? 'Try another name or host.' : 'There are no events to show right now.'}</p></div>}
        <div className="event-grid">{visibleEvents.map((event, index) => <EventCard key={event.id ?? event.eventId} event={event} index={index} />)}</div>
      </section>
      <footer className="page-footer"><span>EVENTIFY</span><span>Good plans start here.</span><a href="/register">Join the community ↗</a></footer>
    </main>
  )
}