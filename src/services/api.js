import axios from 'axios'

export const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('eventify-token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export function getErrorMessage(error) {
  const responseData = error.response?.data
  if (typeof responseData === 'string') return responseData
  if (responseData?.message) return responseData.message
  if (responseData) return JSON.stringify(responseData)
  return error.message || 'Something went wrong.'
}