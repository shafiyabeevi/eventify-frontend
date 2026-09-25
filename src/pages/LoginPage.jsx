import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { homeForRole, useAuth } from '../context/AuthContext.jsx'
import { getErrorMessage } from '../services/api.js'

export default function LoginPage() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (user) return <Navigate to={homeForRole(user.role)} replace />

  async function handleSubmit(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      const signedInUser = await login(form)
      navigate(homeForRole(signedInUser.role), { replace: true })
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-aside">
        <p className="eyebrow">MAKE ROOM FOR A GOOD TIME</p>
        <h1>Your next<br />great story<br /><em>starts here.</em></h1>
        <p>Find the people, places, and moments worth showing up for.</p>
        <span className="aside-note">A city full of things to do.</span>
      </section>
      <section className="auth-panel">
        <div className="auth-form-wrap">
          <p className="eyebrow">WELCOME BACK</p>
          <h2>Sign in</h2>
          <p className="muted">Pick up where your plans left off.</p>
          <form onSubmit={handleSubmit} className="form-stack">
            <label>Email address<input type="email" autoComplete="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label>
            <label>Password<input type="password" autoComplete="current-password" required value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></label>
            {error && <p className="form-message error-message" role="alert">{error}</p>}
            <button className="button button-dark button-wide" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'} <span aria-hidden="true">→</span></button>
          </form>
          <p className="auth-switch">New to Eventify? <Link to="/register">Create an account</Link></p>
        </div>
      </section>
    </main>
  )
}