import axios from 'axios'

const isDevelopment = import.meta.env.VITE_STAGE === 'dev'

const apiClient = axios.create({
  baseURL: isDevelopment ? '/api/v1' : import.meta.env.VITE_API_URL,
})
// Interceptrors
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    console.log('Si hay token existente')
    config.headers['Token'] = token
    console.log('Aqui ya se puso el Token en el header')
  }
  return config
})

export { apiClient }
