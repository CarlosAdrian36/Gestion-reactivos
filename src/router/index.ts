import LayoutPrincipal from '@/app/layout/layoutPrincipal.vue'
import { bancoRoutes } from '@/app/routes'
import { loginRoute } from '@/auth/routes'
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/auth/store/auth.store'
import { AuthStatus } from '@/auth/interface/auth-status.enum'

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
  const authStore = useAuthStore()

  if (to.meta?.requiresAuth) {
    const localToken = localStorage.getItem('token')
    if (!localToken) {
      authStore.clearSession()
      next({ name: 'login' })
      return
    }

    if (authStore.authStatus === AuthStatus.Checking) {
      await authStore.checkAuthStatus()
    }

    if (authStore.authStatus === AuthStatus.NotAuthenticated) {
      next({ name: 'login' })
      return
    }
  }

  if (to.path.startsWith('/auth')) {
    if (authStore.authStatus === AuthStatus.Checking) {
      await authStore.checkAuthStatus()
    }

    if (authStore.authStatus === AuthStatus.Authenticated) {
      next({ name: 'misBancos' })
      return
    }
  }

  next()
})

export default router
