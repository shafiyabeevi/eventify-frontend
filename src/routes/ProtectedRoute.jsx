import { Navigate, Outlet } from 'react-router-dom'
import { homeForRole, useAuth } from '../context/AuthContext.jsx'

export default function ProtectedRoute({ role }) {
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) return <Navigate to={homeForRole(user.role)} replace />
  return <Outlet />
}