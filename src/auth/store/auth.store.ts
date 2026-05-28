import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { AuthStatus, type LoginCredentials } from '../interface'
import { checkAuthAction, loginAction } from '../actions'
import { useLocalStorage } from '@vueuse/core'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(useLocalStorage('token', ''))
  const authStatus = ref(AuthStatus.Checking)

  const login = async (data: LoginCredentials) => {
    try {
      const loginResp = await loginAction(data)
      if (!loginResp.ok) {
        logout()
        return false
      }

      token.value = loginResp.token
      authStatus.value = AuthStatus.Authenticated

      return true
    } catch (error) {
      return logout()
    }
  }
  const checkAuthStatus = async (): Promise<boolean> => {
    try {
      const statusResp = await checkAuthAction()
      console.warn(statusResp)
      if (!statusResp.ok) {
        logout()
        return false
      }
      authStatus.value = AuthStatus.Authenticated
      // token.value = token.value
      return true
    } catch (error) {
      logout()
      return false
    }
  }

  const logout = () => {
    authStatus.value = AuthStatus.NotAuthenticated
    token.value = ''
    return false
  }

  return {
    token,
    authStatus,

    //Getters

    isChecking: computed(() => authStatus.value === AuthStatus.Checking),
    isAuthenticated: computed(() => authStatus.value === AuthStatus.Authenticated),

    //Actions
    login,
    logout,
    checkAuthStatus,
  }
})
