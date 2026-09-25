import { api } from './api.js'

export async function getEvents() {
  return (await api.get('/events')).data
}

export async function getOrganizerEvents() {
  return (await api.get('/events/organizer/mine')).data
}

export async function getEvent(id) {
  return (await api.get(`/events/${id}`)).data
}

export async function createEvent(details) {
  return (await api.post('/events', details)).data
}

export async function updateEvent(id, details) {
  return (await api.put(`/events/${id}`, details)).data
}

export async function deleteEvent(id) {
  return (await api.delete(`/events/${id}`)).data
}

export async function bookTickets(eventId, numberOfTickets) {
  return (await api.post('/bookings', { eventId, numberOfTickets })).data
}

export async function getOrganizerEventStatistics() {
  return (await api.get('/bookings/organizer/statistics')).data
}

function receiptKey(email) {
  return `eventify-booking-receipts:${email}`
}

export function getSavedReceipts(email) {
  try {
    return JSON.parse(localStorage.getItem(receiptKey(email)) || '[]')
  } catch {
    return []
  }
}

export function saveReceipt(receipt, email) {
  localStorage.setItem(receiptKey(email), JSON.stringify([receipt, ...getSavedReceipts(email)]))
}