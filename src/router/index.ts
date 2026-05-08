import LayoutPrincipal from '@/app/layout/layoutPrincipal.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LayoutPrincipal,
    },
  ],
})

export default router
