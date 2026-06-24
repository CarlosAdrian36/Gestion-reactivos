import { useAuthStore } from '../store/auth.store'

export const hasRequiredRoles = (requiredRoles: string[]): boolean => {
  const authStore = useAuthStore()

  if (!authStore.user || !authStore.user.roles.length) return false

  return authStore.user.roles.some((role) => requiredRoles.includes(role.nombre))
}
