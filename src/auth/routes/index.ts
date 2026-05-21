import type { RouteRecordRaw } from 'vue-router'

export const loginRoute: RouteRecordRaw = {
  path: '/auth',
  name: 'auth',
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
