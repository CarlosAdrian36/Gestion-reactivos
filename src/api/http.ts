import axios, { type InternalAxiosRequestConfig } from 'axios'

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retriedWithCurrentToken?: boolean
}

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
      const config = error.config as RetryableRequestConfig | undefined
      const esPeticionDeRenovacion = config?.url?.includes('/sesion/refresh') ?? false

      if (config && !esPeticionDeRenovacion) {
        if (authStore.isExtendingSession) {
          try {
            await authStore.esperarExtensionSesion()
          } catch {
            // Si falla la renovación, abajo se procesa el 401 normalmente.
          }
        }

        const tokenActual = localStorage.getItem('token')
        const tokenEnviado = String(config.headers.get('Token') ?? '')

        if (
          tokenActual &&
          tokenActual !== tokenEnviado &&
          !config._retriedWithCurrentToken
        ) {
          config._retriedWithCurrentToken = true
          config.headers.set('Token', tokenActual)
          return apiClient.request(config)
        }
      }

      if (authStore.isChecking || authStore.isAuthenticated) {
        authStore.clearSession()
      }
    }

    return Promise.reject(error)
  },
)

export { apiClient }
