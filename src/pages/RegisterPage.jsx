import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { homeForRole, useAuth } from '../context/AuthContext.jsx'
import { getErrorMessage } from '../services/api.js'

const strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9\s]).{8,}$/

export default function RegisterPage() {
  const { user, register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'CUSTOMER' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const passwordIsStrong = strongPasswordPattern.test(form.password)

  if (user) return <Navigate to={homeForRole(user.role)} replace />

  async function handleSubmit(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    setMessage('')
    try {
      const result = await register(form)
      setMessage(typeof result === 'string' ? result : 'Account created. You can now sign in.')
      window.setTimeout(() => navigate('/login'), 1200)
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-aside register-aside">
        <p className="eyebrow">GOOD THINGS HAPPEN OUT THERE</p>
        <h1>Find your<br />kind of<br /><em>gathering.</em></h1>
        <p>Join a community built around doing more together.</p>
        <span className="aside-note">Your people are out there.</span>
      </section>
      <section className="auth-panel">
        <div className="auth-form-wrap">
          <p className="eyebrow">GET STARTED</p>
          <h2>Create account</h2>
          <p className="muted">One account, many good plans.</p>
          <form onSubmit={handleSubmit} className="form-stack">
            <label>Full name<input autoComplete="name" required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
            <label>Email address<input type="email" autoComplete="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label>
            <label className="password-field">Password
              <input
                type="password"
                autoComplete="new-password"
                minLength={8}
                pattern={strongPasswordPattern.source}
                title="Use at least 8 characters with uppercase, lowercase, a number, and a special character."
                aria-describedby="password-requirements"
                aria-invalid={form.password.length > 0 && !passwordIsStrong}
                required
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
              />
              <span id="password-requirements" className={`password-requirements${form.password.length > 0 && !passwordIsStrong ? ' is-invalid' : ''}`}>
                {passwordIsStrong ? 'Strong password.' : 'Use 8+ characters with uppercase, lowercase, a number, and a special character.'}
              </span>
            </label>
            <label>Account type<select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
              <option value="CUSTOMER">Customer</option>
              <option value="EVENT_ORGANIZER">Organizer</option>
            </select></label>
            {error && <p className="form-message error-message" role="alert">{error}</p>}
            {message && <p className="form-message success-message" role="status">{message}</p>}
            <button className="button button-dark button-wide" disabled={busy}>{busy ? 'Creating account…' : 'Create account'} <span aria-hidden="true">→</span></button>
          </form>
          <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
        </div>
      </section>
    </main>
  )
}