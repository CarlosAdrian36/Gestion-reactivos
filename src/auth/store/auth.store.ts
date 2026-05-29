import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { AuthStatus, type LoginCredentials } from '../interface'
import { checkAuthAction, loginAction } from '../actions'
import { useLocalStorage } from '@vueuse/core'

export const useAuthStore = defineStore('auth', () => {
  const token = useLocalStorage('token', '')
  const authStatus = ref<AuthStatus>(AuthStatus.Checking)
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

      return true
    } catch (error) {
      return logout()
    }
  }
  const checkAuthStatus = async (): Promise<boolean> => {
    try {
      const statusResp = await checkAuthAction()
      if (!statusResp.ok) {
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

  const logout = () => {
    console.error('logout Ejecutado')
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
