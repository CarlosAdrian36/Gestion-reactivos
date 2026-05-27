import LayoutPrincipal from '@/app/layout/layoutPrincipal.vue'
import { loginRoute } from '@/auth/routes'
import { useAuthStore } from '@/auth/store/auth.store'
import { createRouter, createWebHistory } from 'vue-router'

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
          path: 'mis-bancos/banco/:id',
          name: 'bancoDetalle',
          component: () => import('@/app/bancos/bancodetalle/bancoMenu.vue'),
        },
      ],
    },
  ],
})

router.beforeEach((to) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some((route) => route.meta.requiresAuth)

  authStore.checkAuthStatus()

  if (requiresAuth && !authStore.isAuthenticated()) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.name === 'login' && authStore.isAuthenticated()) {
    return { name: 'misBancos' }
  }
})
export default router
