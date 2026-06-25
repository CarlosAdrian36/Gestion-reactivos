import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { AuthStatus, type Cuenta, type LoginCredentials } from '../interface'
import { checkAuthAction, loginAction } from '../actions'
import { getPerfilAction } from '@/api/usuarios/actions/get-perfil.action'
import { useLocalStorage } from '@vueuse/core'
import { logoutApi } from '../api/auth.api'
import { useModalStore } from '@/common/modals/store/modal.store'
import { queryClient } from '@/api/queryClient'

export const useAuthStore = defineStore('auth', () => {
  const token = useLocalStorage('token', '')
  const authStatus = ref<AuthStatus>(AuthStatus.Checking)
  const expiracion = useLocalStorage('expiracion', 0)
  const user = ref<Cuenta | null>(null)
  const modal = useModalStore()
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

  const login = async (data: LoginCredentials): Promise<{ ok: boolean; message?: string; conflict?: boolean }> => {
    authStatus.value = AuthStatus.Checking

    try {
      const loginResp = await loginAction(data)
      if (!loginResp.ok) {
        if (loginResp.conflict) {
          return { ok: false, message: loginResp.message, conflict: true }
        }
        clearSession()
        return { ok: false, message: loginResp.message }
      }

      token.value = loginResp.token
      authStatus.value = AuthStatus.Authenticated
      expiracion.value = Date.now() + loginResp.tiempoRestante * 1000

      await loadUserProfile()

      return { ok: true }
    } catch (error) {
      clearSession()
      return { ok: false, message: 'Error al conectar con el servidor' }
    }
  }
  const checkAuthStatus = async (): Promise<boolean> => {
    authStatus.value = AuthStatus.Checking
    try {
      const statusResp = await checkAuthAction()
      if (!statusResp) {
        clearSession()
        return false
      }
      authStatus.value = AuthStatus.Authenticated

      await loadUserProfile()

      return true
    } catch (error) {
      clearSession()
      return false
    }
  }

  const loadUserProfile = async () => {
    try {
      const perfil = await getPerfilAction()
      user.value = perfil
    } catch (error) {
      console.error('Error al cargar perfil:', error)
    }
  }

  const logout = async () => {
    console.error('logout Ejecutado')

    try {
      if (token.value) {
        const logoutResp = await logoutApi()
        console.warn('logoutResp', logoutResp)
        if (logoutResp === false) {
          return false
        }
        clearSession()
        return true
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
      return false
    }
  }
  const clearSession = () => {
    modal.isOpen = false
    modal.closeModal()
    token.value = ''
    expiracion.value = 0
    user.value = null
    authStatus.value = AuthStatus.NotAuthenticated
    localStorage.removeItem('token')
    localStorage.removeItem('expiracion')
    queryClient.clear()
  }
  watch(remainingSeconds, async (value) => {
    if (value <= 0 && token.value) {
      const result = await logout()
      if (!result) {
        clearSession()
      }
    }
  })

  return {
    token,
    authStatus,
    user,
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
    loadUserProfile,
    clearSession,
  }
})
