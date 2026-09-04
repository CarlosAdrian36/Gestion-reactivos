import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})
// Interceptrors
apiClient.interceptors.request.use((config) => {
  console.log(
    '[API Request]',
    config.method?.toUpperCase(),
    (config.baseURL ?? '') + (config.url ?? ''),
  )
  if (!config.headers['Token']) {
    const token = localStorage.getItem('token')

    if (token) {
      config.headers['Token'] = token
      console.log('[Interceptor Token]', token ? token.substring(0, 20) + '...' : 'VACÍO')
    }
  }
  return config
})

export { apiClient }
