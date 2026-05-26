import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { AuthStatus, type LoginCredentials } from '../interface'
import { loginAction } from '../actions'
import { useLocalStorage } from '@vueuse/core'

export const useAuthStore = defineStore('auth', () => {
  // Autenticado,desautenticado,verificando
  const expiresAt = useLocalStorage('expiresAt', 0)
  const token = ref(useLocalStorage('token', ''))
  const authStatus = ref(
    token.value && Date.now() < expiresAt.value
      ? AuthStatus.Authenticated
      : AuthStatus.NotAuthenticated,
  )
  const remainingMs = computed(() => Math.max(expiresAt.value - Date.now(), 0))

  const remainingSeconds = computed(() => Math.floor(remainingMs.value / 1000))

  const isTokenExpired = computed(() => !token.value || remainingSeconds.value <= 0)

  const login = async (data: LoginCredentials) => {
    try {
      const loginResp = await loginAction(data)
      if (!loginResp.ok) {
        logout()
        return false
      }
      token.value = loginResp.token
      expiresAt.value = Date.now() + loginResp.tiempoRestante * 1000
      authStatus.value = AuthStatus.Authenticated
      return true
    } catch (error) {
      return logout()
    }
  }

  const logout = () => {
    authStatus.value = AuthStatus.NotAuthenticated
    token.value = ''
    expiresAt.value = 0
    return false
  }
  const checkAuthStatus = () => {
    if (isTokenExpired.value) {
      logout()
      return false
    }

    authStatus.value = AuthStatus.Authenticated
    return true
  }
  return {
    // user,
    token,
    expiresAt,
    authStatus,
    remainingMs,
    remainingSeconds,
    isTokenExpired,

    // Getters
    isChecking: () => authStatus.value === AuthStatus.Checking,
    isAuthenticated: () => authStatus.value === AuthStatus.Authenticated,
    isNotAuthenticated: () => authStatus.value === AuthStatus.NotAuthenticated,

    // Actions
    login,
    logout,
    checkAuthStatus,
  }
})
