import { Link } from 'react-router-dom'

export function formatEventDate(dateValue) {
  if (!dateValue) return 'Date to be announced'
  const parsed = new Date(dateValue)
  if (Number.isNaN(parsed.getTime())) return dateValue
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(parsed)
}

export default function EventCard({ event, index = 0 }) {
  const eventId = event.id ?? event.eventId
  const day = event.eventDate ? new Date(event.eventDate).getDate() : '—'
  const themes = ['card-lime', 'card-coral', 'card-lavender', 'card-blue']

  return (
    <article className="event-card">
      <Link className={`event-art ${themes[index % themes.length]}`} to={`/events/${eventId}`} aria-label={`View ${event.eventName}`}>
        <span className="art-kicker">EVENTIFY / {String(index + 1).padStart(2, '0')}</span>
        <span className="art-date">{day}</span>
        <span className="art-name">{event.eventName}</span>
        <span className="art-stamp" aria-hidden="true">E</span>
      </Link>
      <div className="event-card-info">
        <p className="event-date"><span aria-hidden="true">◷</span>{formatEventDate(event.eventDate)}</p>
        <h3><Link to={`/events/${eventId}`}>{event.eventName}</Link></h3>
        <p className="event-organizer"><span aria-hidden="true">◉</span>Hosted by {event.organizerName || 'Event organizer'}</p>
        <div className="event-card-footer">
          <strong className="event-price">${Number(event.ticketPrice || 0).toFixed(2)} <span>/ ticket</span></strong>
          <Link className="event-card-action" to={`/events/${eventId}`}>View event <span aria-hidden="true">→</span></Link>
        </div>
      </div>
    </article>
  )
}