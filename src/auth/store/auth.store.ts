import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { AuthStatus, type LoginCredentials } from '../interface'
import { loginAction } from '../actions'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string>()
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
  }
})
