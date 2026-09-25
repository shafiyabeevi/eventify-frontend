import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { getSavedReceipts } from '../services/eventService.js'

export function CustomerBookingsPage() {
  const { user } = useAuth()
  const receipts = getSavedReceipts(user.email)

  return (
    <main className="page-shell dashboard-page">
      <Link className="back-link" to="/customer">← Customer home</Link>
      <div className="section-heading bookings-heading"><div><p className="eyebrow">YOUR PLANS</p><h1>Booking receipts</h1></div><Link className="button button-dark" to="/events">Find an event <span aria-hidden="true">→</span></Link></div>
      <p className="local-note">Your Eventify reservations, ticket quantities, and totals.</p>
      {receipts.length === 0 ? <div className="empty-state"><span>↗</span><h3>No receipts yet.</h3><p>Once you book an event, its receipt will appear here.</p><Link to="/events">Browse events</Link></div> : (
        <div className="receipt-list">{receipts.map((receipt) => (
          <article className="receipt-row" key={receipt.receiptKey}>
            <span className="receipt-check" aria-hidden="true">▤</span>
            <div className="receipt-name">
              <h2>{receipt.eventName}</h2>
              <p>{receipt.eventDate || 'Date to be announced'}</p>
              <small className="receipt-booked-date">{receipt.savedAt ? `Saved ${new Date(receipt.savedAt).toLocaleDateString()}` : 'Saved booking receipt'}</small>
            </div>
            <div className="receipt-total"><strong>${Number(receipt.totalAmount).toFixed(2)}</strong><span>{receipt.numberOfTickets} {receipt.numberOfTickets === 1 ? 'ticket' : 'tickets'}</span></div>
            <span className="receipt-status">{receipt.confirmation}</span>
          </article>
        ))}</div>
      )}
    </main>
  )
}