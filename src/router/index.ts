import LayoutPrincipal from '@/app/layout/layoutPrincipal.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LayoutPrincipal,
      children: [
        {
          path: 'mis-bancos',
          name: 'misBancos',
          component: () => import('@/app/views/misbancos.vue'),
        },
        {
          path: 'proyectos',
          name: 'proyectos',
          component: () => import('@/app/views/proyectos.vue'),
        },
      ],
    },
  ],
})

export default router
