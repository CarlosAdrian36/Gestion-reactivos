import axios from 'axios'

const isDevelopment = import.meta.env.VITE_STAGE === 'dev'

const apiClient = axios.create({
  baseURL: isDevelopment ? '/api/v1' : import.meta.env.VITE_API_URL,
})
// Interceptrors
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export { apiClient }
