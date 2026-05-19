import type { RouteRecordRaw } from 'vue-router'

export const loginRoute: RouteRecordRaw[] = [
  {
    path: '/layoutlogin',
    name: 'layoutlogin',
    redirect: '/login',
    component: () => import('@/auth/layout/layoutlogin.vue'),
    children: [
      {
        path: '/login',
        name: 'login',
        component: () => import('@/auth/views/login.vue'),
      },
    ],
  },
]
