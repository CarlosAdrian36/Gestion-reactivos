import { defineStore } from 'pinia'
import { ref } from 'vue'
import { AuthStatus, type LoginCredentials } from '../interface'
import { loginAction } from '../actions'

export const useAuthStore = defineStore('auth', () => {
  // Autenticado,desautenticado,verificando
  const authStatus = ref(AuthStatus.Checking)
  // const user = ref<LoginRequest | undefined>()
  const token = ref('')

  const login = async (data: LoginCredentials) => {
    try {
      const loginResp = await loginAction(data)
      if (!loginResp.ok) {
        return false
      }
      token.value = loginResp.token
      authStatus.value = AuthStatus.Authenticated
      return true
    } catch (error) {
      return logout()
    }
  }

  const logout = () => {
    authStatus.value = AuthStatus.NotAuthenticated
    token.value = ''
    return false
  }
  return {
    // user,
    token,
    authStatus,

    // Getters
    isChecking: () => authStatus.value === AuthStatus.Checking,
    isAuthenticated: () => authStatus.value === AuthStatus.Authenticated,
    isNotAuthenticated: () => authStatus.value === AuthStatus.NotAuthenticated,

    // Actions
    login,
    logout,
  }
})
