import { Link, NavLink, useNavigate } from 'react-router-dom'
import { homeForRole, useAuth } from '../context/AuthContext.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <header className="site-header">
      <Link className="brand" to={user ? homeForRole(user.role) : '/events'}>
        <span className="brand-mark">e</span> eventify
      </Link>
      <nav className="nav-links" aria-label="Main navigation">
        <NavLink to="/events">Discover</NavLink>
        {user?.role === 'CUSTOMER' && <NavLink to="/customer/bookings">My bookings</NavLink>}
        {user?.role === 'ORGANIZER' && <NavLink to="/organizer/events">My events</NavLink>}
      </nav>
      <div className="nav-actions">
        {user ? (
          <>
            <span className="nav-user">{user.email}</span>
            <button className="button button-small button-outline" onClick={handleLogout}>Log out</button>
          </>
        ) : (
          <Link className="button button-small button-dark" to="/login">Log in</Link>
        )}
      </div>
    </header>
  )
}