import LayoutPrincipal from '@/app/layout/layoutPrincipal.vue'
import { bancoRoutes } from '@/app/routes'
import { loginRoute } from '@/auth/routes'
import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticatedGuard } from '@/auth/guards/is-authenticated.guard'
import { isNotAuthenticatedGuard } from '@/auth/guards/is-not-authenticated.guard'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    loginRoute,
    {
      path: '/',
      name: 'home',
      component: LayoutPrincipal,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'mis-bancos',
          name: 'misBancos',
          component: () => import('@/app/views/misbancos.vue'),
        },
        ...bancoRoutes,
        {
          path: 'Proyectos',
          name: 'proyectos',
          component: () => import('@/app/views/gestionProyectos.vue'),
        },
        {
          path: 'Compartidos',
          name: 'compartidos',
          component: () => import('@/app/views/compartidos.vue'),
        },
        {
          path: 'Usuarios',
          name: 'usuarios',
          component: () => import('@/app/views/usuarios.vue'),
        },
        {
          path: 'Recursos',
          name: 'recursos',
          component: () => import('@/app/views/recursos.vue'),
        },
        {
          path: 'Perfil',
          name: 'perfil',
          component: () => import('@/app/views/perfil.vue'),
        },
      ],
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  if (to.meta?.requiresAuth) {
    await isAuthenticatedGuard(to, from, next)
    return
  }

  if (to.path.startsWith('/auth')) {
    await isNotAuthenticatedGuard(to, from, next)
    return
  }

  next()
})

export default router
