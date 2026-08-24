import type { RouteRecordRaw } from 'vue-router'
import { validarSolicitudCambioContrasena } from '../actions/validarSolicitud.action'

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
      beforeEnter: async (to, _from, next) => {
        const solicitudId = to.query.SolicitudId as string
        if (!solicitudId) {
          next({ name: 'Error' })
          return
        }
        try {
          const valido = await validarSolicitudCambioContrasena(solicitudId)
          if (valido) next()
          else next({ name: 'Error' })
        } catch {
          next({ name: 'Error' })
        }
      },
    },
    {
      path: 'Error',
      name: 'Error',
      component: () => import('@/auth/views/expiracionToken.vue'),
    },
  ],
}
