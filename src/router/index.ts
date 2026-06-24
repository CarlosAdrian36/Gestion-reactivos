import LayoutPrincipal from '@/app/layout/layoutPrincipal.vue'
import { bancoRoutes } from '@/app/routes'
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
      ],
    },
  ],
})

export default router
