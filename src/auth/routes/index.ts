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
    {
      path: 'enviar-correo',
      name: 'EnviodeCorreo',
      component: () => import('@/auth/views/envioCorreo.vue'),
    },
    {
      path: 'establecerContrasena',
      name: 'establecer',
      component: () => import('@/auth/views/establecerContrasena.vue'),
    },
    {
      path: 'Error',
      name: 'Error',
      component: () => import('@/auth/views/expiracionToken.vue'),
    },
  ],
}
