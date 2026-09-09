import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

apiClient.interceptors.request.use((config) => {
  if (!config.headers['Token']) {
    const token = localStorage.getItem('token')

    if (token) {
      config.headers['Token'] = token
    }
  }
  config.headers['Cache-Control'] = 'no-store'
  config.headers['Pragma'] = 'no-cache'
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const { useAuthStore } = await import('@/auth/store/auth.store')
      const authStore = useAuthStore()

      if (authStore.isChecking || authStore.isAuthenticated) {
        authStore.clearSession()
      }
    }

    return Promise.reject(error)
  },
)

export { apiClient }
