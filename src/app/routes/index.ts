import type { RouteRecordRaw } from 'vue-router'

export const bancoRoutes: RouteRecordRaw[] = [
  {
    path: 'mis-bancos/carpetas/:id',
    name: 'carpetaDetalle',
    component: () => import('@/app/carpetas/carpetadetalle/carpetaDetalle.vue'),
    props: true,
  },
  {
    path: 'banco/:id',
    name: 'bancoDetalle',
    component: () => import('@/app/bancos/bancodetalle/bancoMenu.vue'),
  },
]
