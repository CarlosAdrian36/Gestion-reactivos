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
    meta: { sidebar: 'default' },
  },
  {
    path: 'banco/:id/reactivos',
    name: 'reactivosList',
    component: () => import('@/app/bancos/reactivos/reactivosView.vue'),
    meta: { sidebar: 'reactivos' },
  },
  {
    path: 'banco/:id/reactivos/editar',
    name: 'editarReactivo',
    component: () => import('@/app/bancos/reactivos/editarReactivo.vue'),
    meta: { sidebar: 'reactivos' },
  },
  {
    path: 'banco/:id/reactivos/crear',
    name: 'crearReactivo',
    component: () => import('@/app/bancos/reactivos/crearReactivo.vue'),
    meta: { sidebar: 'reactivos' },
  },
]
