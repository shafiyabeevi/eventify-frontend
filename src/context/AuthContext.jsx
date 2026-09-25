import { createContext, useContext, useState } from 'react'
import { api } from '../services/api.js'

const AuthContext = createContext(null)
const TOKEN_KEY = 'eventify-token'

function getClaims(token) {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(decodeURIComponent(escape(window.atob(payload))))
  } catch {
    return null
  }
}

function makeUser(token) {
  const claims = getClaims(token)
  if (!claims || (claims.exp && claims.exp * 1000 < Date.now())) return null

  const tokenRole = String(claims.role || '').replace(/^ROLE_/, '').toUpperCase()
  const role = tokenRole === 'EVENT_ORGANIZER' ? 'ORGANIZER' : tokenRole
  if (!['CUSTOMER', 'ORGANIZER'].includes(role)) return null

  return { role, email: claims.sub || '' }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const user = token ? makeUser(token) : null

  async function login(credentials) {
    const response = await api.post('/auth/login', credentials, {
      transformResponse: [(data) => data],
    })
    const receivedToken = String(response.data).trim().replace(/^"|"$/g, '')
    const nextUser = makeUser(receivedToken)
    if (!nextUser) throw new Error('The login response did not contain a supported JWT role.')
    localStorage.setItem(TOKEN_KEY, receivedToken)
    setToken(receivedToken)
    return nextUser
  }

  async function register(details) {
    const response = await api.post('/auth/register', details)
    return response.data
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

export function homeForRole(role) {
  return role === 'ORGANIZER' ? '/organizer' : '/events'
}