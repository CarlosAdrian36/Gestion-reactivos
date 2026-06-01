import type { RouteRecordRaw } from 'vue-router'
import { isNotAuthenticatedGuard } from '../guards/is-not-authenticated.guard'

export const loginRoute: RouteRecordRaw = {
  path: '/auth',
  name: 'auth',
  beforeEnter: [isNotAuthenticatedGuard],
  redirect: { name: 'login' },
  component: () => import('@/auth/layout/layoutlogin.vue'),
  children: [
    {
      path: 'login',
      name: 'login',
      component: () => import('@/auth/views/login.vue'),
    },
  ],
}
