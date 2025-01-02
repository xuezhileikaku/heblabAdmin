const env = (import.meta.env.VITE_APP_ENV || 'development') as 'development' | 'production'

const apiUrl = {
  development: 'http://localhost:8787',
  production: 'https://heblab.teach'
}[env]

export default apiUrl