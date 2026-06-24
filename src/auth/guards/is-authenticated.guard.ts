import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '../store/auth.store'
import { AuthStatus } from '../interface'

export const isAuthenticatedGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  const authStore = useAuthStore()

  if (authStore.authStatus === AuthStatus.Checking) {
    await authStore.checkAuthStatus()
  }

  if (authStore.authStatus === AuthStatus.NotAuthenticated) {
    next({ name: 'login' })
    return
  }

  next()
}

export default isAuthenticatedGuard
