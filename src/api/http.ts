import axios from 'axios'

const isDevelopment = import.meta.env.VITE_STAGE === 'dev'

const apiClient = axios.create({
  baseURL: isDevelopment ? '/api/v1' : import.meta.env.VITE_API_URL,
})
// Interceptrors
apiClient.interceptors.request.use((config) => {
  console.log('[API Request]', config.method?.toUpperCase(), (config.baseURL ?? '') + (config.url ?? ''))
  if (!config.headers['Token']) {
    const token = localStorage.getItem('token')

    if (token) {
      config.headers['Token'] = token
    }
  }
  return config
})

export { apiClient }
