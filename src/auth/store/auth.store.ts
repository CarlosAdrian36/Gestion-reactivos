import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { AuthStatus, type Cuenta, type LoginCredentials } from '../interface'
import { actualizarRolSesionAction, checkAuthAction, loginAction } from '../actions'
import { getPerfilAction } from '@/api/usuarios/actions/get-perfil.action'
import { useLocalStorage } from '@vueuse/core'
import { logoutApi } from '../api/auth.api'
import { useModalStore } from '@/common/modals/store/modal.store'
import { queryClient } from '@/api/queryClient'
import ExtenderSesion from '@/app/common/components/modals/extenderSesion.vue'
import { extenderSesionAction } from '../actions/extenderSesion'

export const useAuthStore = defineStore('auth', () => {
  const token = useLocalStorage('token', '')
  const authStatus = ref<AuthStatus>(AuthStatus.Checking)
  const expiracion = useLocalStorage('expiracion', 0)
  const rolActivoId = useLocalStorage<number | null>('rolActivoId', null)
  const user = ref<Cuenta | null>(null)
  const modal = useModalStore()
  const now = ref(Date.now())
  const avisoExtenisonMostrado = ref(false)

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

  let authCheckPromise: Promise<boolean> | null = null
  let isLoggingOut = false

  const login = async (
    data: LoginCredentials,
    Imperative = false,
  ): Promise<{ ok: boolean; message?: string }> => {
    authStatus.value = AuthStatus.Checking

    try {
      const loginResp = await loginAction(data, Imperative)
      console.log('loginResp', loginResp)
      if (!loginResp.ok) {
        clearSession()
        return { ok: false, message: loginResp.message }
      }

      token.value = loginResp.token
      authStatus.value = AuthStatus.Authenticated
      expiracion.value = Date.now() + loginResp.tiempoRestante * 1000
      rolActivoId.value = null
      avisoExtenisonMostrado.value = false
      await loadUserProfile()

      return { ok: true }
    } catch {
      clearSession()
      return { ok: false, message: 'Error al conectar con el servidor' }
    }
  }
  const checkAuthStatus = (): Promise<boolean> => {
    if (authCheckPromise) return authCheckPromise

    authStatus.value = AuthStatus.Checking
    authCheckPromise = (async () => {
      try {
        const esValida = await checkAuthAction()
        if (!esValida) {
          clearSession()
          return false
        }
        authStatus.value = AuthStatus.Authenticated
        loadUserProfile()

        return true
      } catch {
        clearSession()
        return false
      } finally {
        authCheckPromise = null
      }
    })()

    return authCheckPromise
  }

  const loadUserProfile = async () => {
    try {
      const perfil = await getPerfilAction()
      user.value = perfil
      if (!perfil.roles.some((rol) => rol.rolId === rolActivoId.value)) {
        rolActivoId.value = perfil.roles[0]?.rolId ?? null
      }
    } catch (error) {
      console.error('Error al cargar perfil:', error)
    }
  }

  const actualizarRolSesion = async (rolId: number) => {
    if (!user.value?.roles.some((rol) => rol.rolId === rolId)) {
      throw new Error('No tienes asignado este rol')
    }

    const sesion = await actualizarRolSesionAction(rolId)
    if (!sesion?.token || !Number.isFinite(sesion.tiempoRestante)) {
      throw new Error('El servidor devolvió datos de sesión incompletos')
    }

    token.value = sesion.token
    expiracion.value = Date.now() + sesion.tiempoRestante * 1000
    rolActivoId.value = rolId
    avisoExtenisonMostrado.value = false
    queryClient.clear()
  }

  const logout = async () => {
    try {
      if (token.value) {
        const logoutResp = await logoutApi()
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
  const hasActiveSession = (): boolean => {
    return !!token.value && expiracion.value > Date.now()
  }

  const getRemainingTime = (): string => {
    const diff = Math.floor((expiracion.value - Date.now()) / 1000)
    if (diff <= 0) return '0 segundos'
    const mins = Math.floor(diff / 60)
    const secs = diff % 60
    if (mins > 0) {
      return `${mins} minuto${mins !== 1 ? 's' : ''} y ${secs} segundo${secs !== 1 ? 's' : ''}`
    }
    return `${secs} segundo${secs !== 1 ? 's' : ''}`
  }
  const extenderSesion = async () => {
    const { sesionDTO } = await extenderSesionAction()
    token.value = sesionDTO.token
    expiracion.value = Date.now() + sesionDTO.tiempoRestante * 1000
    avisoExtenisonMostrado.value = false
  }

  const clearSession = () => {
    modal.isOpen = false
    modal.closeModal()
    token.value = ''
    expiracion.value = 0
    rolActivoId.value = null
    user.value = null
    authStatus.value = AuthStatus.NotAuthenticated
    localStorage.removeItem('token')
    localStorage.removeItem('expiracion')
    localStorage.removeItem('rolActivoId')
    queryClient.clear()
    user.value = null
    avisoExtenisonMostrado.value = false
  }
  watch(remainingSeconds, (value) => {
    if (value <= 300 && value > 0 && token.value && !avisoExtenisonMostrado.value) {
      avisoExtenisonMostrado.value = true
      modal.openModal(ExtenderSesion, {}, [
        { label: 'No', variant: 'outline' },
        { label: 'Extender', variant: 'primary', type: 'submit' },
      ])
    }
  })
  watch(remainingSeconds, async (value) => {
    if (value <= 0 && token.value && !isLoggingOut) {
      isLoggingOut = true
      try {
        const result = await logout()
        if (!result) {
          clearSession()
        }
      } finally {
        isLoggingOut = false
      }
    }
  })

  watch(token, (newToken) => {
    if (!newToken && authStatus.value === AuthStatus.Authenticated) {
      clearSession()
    }
  })

  return {
    token,
    authStatus,
    user,
    rolActivoId,
    remainingSeconds,
    minutes,
    seconds,
    rolActivo: computed(
      () => user.value?.roles.find((rol) => rol.rolId === rolActivoId.value) ?? null,
    ),
    //Getters

    isChecking: computed(() => authStatus.value === AuthStatus.Checking),
    isAuthenticated: computed(() => authStatus.value === AuthStatus.Authenticated),
    esAdministrador: computed(
      () =>
        user.value?.roles.some(
          (rol) =>
            rol.rolId === rolActivoId.value &&
            rol.nombre.trim().toLowerCase() === 'administrador',
        ) ?? false,
    ),

    //Actions
    login,
    logout,
    checkAuthStatus,
    loadUserProfile,
    clearSession,
    hasActiveSession,
    getRemainingTime,
    extenderSesion,
    actualizarRolSesion,
  }
})
