import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import EventsPage from './pages/EventsPage.jsx'
import EventDetailPage from './pages/EventDetailPage.jsx'
import ProtectedRoute from './routes/ProtectedRoute.jsx'
import { CustomerBookingsPage } from './pages/CustomerPage.jsx'
import { EventFormPage, OrganizerEventsPage, OrganizerHomePage } from './pages/OrganizerPages.jsx'

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/events" replace />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute role="CUSTOMER" />}>
          <Route path="/customer" element={<Navigate to="/events" replace />} />
          <Route path="/customer/bookings" element={<CustomerBookingsPage />} />
        </Route>
        <Route element={<ProtectedRoute role="ORGANIZER" />}>
          <Route path="/organizer" element={<OrganizerHomePage />} />
          <Route path="/organizer/events" element={<OrganizerEventsPage />} />
          <Route path="/organizer/events/create" element={<EventFormPage />} />
          <Route path="/organizer/events/:id/edit" element={<EventFormPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/events" replace />} />
      </Routes>
    </>
  )
}