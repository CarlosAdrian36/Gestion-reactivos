import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { AuthStatus, type LoginCredentials } from '../interface'
import { checkAuthAction, loginAction } from '../actions'
import { useLocalStorage } from '@vueuse/core'
import { logoutApi } from '../api/auth.api'

export const useAuthStore = defineStore('auth', () => {
  const token = useLocalStorage('token', '')
  const authStatus = ref<AuthStatus>(AuthStatus.Checking)
  const expiracion = useLocalStorage('expiracion', 0)

  const now = ref(Date.now())

  setInterval(() => {
    now.value = Date.now()
  }, 1000)
  const remainingSeconds = computed(() => {
    const diff = Math.floor((expiracion.value - now.value) / 1000)

    return Math.max(diff, 0)
  })

  const minutes = computed(() => {
    return Math.floor(remainingSeconds.value / 60)
  })

  const seconds = computed(() => {
    return remainingSeconds.value % 60
  })

  console.log('1', authStatus.value)

  const login = async (data: LoginCredentials) => {
    console.log('Aqui dio click en el login', authStatus.value)
    try {
      const loginResp = await loginAction(data)
      if (!loginResp.ok) {
        logout()
        return false
      }

      token.value = loginResp.token
      authStatus.value = AuthStatus.Authenticated
      expiracion.value = Date.now() + loginResp.tiempoRestante * 1000
      console.warn('2', expiracion.value)
      return true
    } catch (error) {
      return logout()
    }
  }
  const checkAuthStatus = async (): Promise<boolean> => {
    try {
      const statusResp = await checkAuthAction()
      if (statusResp.ok === false) {
        logout()
        return false
      }
      authStatus.value = AuthStatus.Authenticated
      token.value = statusResp.token
      return true
    } catch (error) {
      logout()
      return false
    }
  }

  const logout = async () => {
    console.error('logout Ejecutado')

    try {
      if (authStatus.value === AuthStatus.Authenticated) {
        const logoutResp = await logoutApi()
        console.warn('logoutResp', logoutResp)
        if (logoutResp === false) {
          return false
        }
        authStatus.value = AuthStatus.NotAuthenticated
        token.value = ''
        expiracion.value = 0
        return true
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
      return false
    }
  }
  watch(remainingSeconds, (value) => {
    if (value <= 0 && token.value) {
      logout()
    }
  })

  return {
    token,
    authStatus,
    remainingSeconds,
    minutes,
    seconds,
    //Getters

    isChecking: computed(() => authStatus.value === AuthStatus.Checking),
    isAuthenticated: computed(() => authStatus.value === AuthStatus.Authenticated),

    //Actions
    login,
    logout,
    checkAuthStatus,
  }
})
