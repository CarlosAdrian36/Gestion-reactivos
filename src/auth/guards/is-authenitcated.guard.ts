import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '../store/auth.store'
import { AuthStatus } from '../interface'

export const isAuthenticatedGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  const authStore = useAuthStore()
  console.log('!!!!!!!!!!!!!!!!!!!!!!!', to)

  console.log('!!!!!!!!!!', authStore.authStatus)
  await authStore.checkAuthStatus()
  authStore.authStatus === AuthStatus.NotAuthenticated ? next({ name: 'login' }) : next()
  return
}

export default isAuthenticatedGuard
