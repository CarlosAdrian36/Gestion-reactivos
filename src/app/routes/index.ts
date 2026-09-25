import type { RouteRecordRaw } from 'vue-router'

export const bancoRoutes: RouteRecordRaw[] = [
  {
    path: 'mis-bancos/carpetas/:id',
    name: 'carpetaDetalle',
    component: () => import('@/app/carpetas/carpetadetalle/carpetaDetalle.vue'),
    props: true,
  },
  {
    path: 'mis-bancos/banco/:id',
    name: 'bancoDetalle',
    component: () => import('@/app/bancos/bancodetalle/bancoMenu.vue'),
    meta: { sidebar: 'default' },
  },
  {
    path: 'mis-bancos/banco/:id/reactivos',
    name: 'reactivosList',
    component: () => import('@/app/bancos/reactivos/reactivosView.vue'),
    meta: { sidebar: 'reactivos' },
  },
  {
    path: 'mis-bancos/banco/:id/reactivos/editar',
    name: 'editarReactivo',
    component: () => import('@/app/bancos/reactivos/editarReactivo.vue'),
    meta: { sidebar: 'reactivos' },
  },
  {
    path: 'mis-bancos/banco/:id/reactivos/crear',
    name: 'crearReactivo',
    component: () => import('@/app/bancos/reactivos/crearReactivo.vue'),
    meta: { sidebar: 'reactivos' },
  },
  {
    path: 'proyectos/banco/:id',
    name: 'proyectoBancoDetalle',
    component: () => import('@/app/proyectos/views/proyectoBancoDetalle.vue'),
    meta: { sidebar: 'default', contexto: 'proyectos' },
  },
  {
    path: 'proyectos/banco/:id/reactivos',
    name: 'proyectoReactivosList',
    component: () => import('@/app/bancos/reactivos/reactivosView.vue'),
    meta: { sidebar: 'reactivos', contexto: 'proyectos' },
  },
  {
    path: 'proyectos/banco/:id/reactivos/editar',
    name: 'proyectoEditarReactivo',
    component: () => import('@/app/bancos/reactivos/editarReactivo.vue'),
    meta: { sidebar: 'reactivos', contexto: 'proyectos' },
  },
  {
    path: 'proyectos/banco/:id/reactivos/crear',
    name: 'proyectoCrearReactivo',
    component: () => import('@/app/bancos/reactivos/crearReactivo.vue'),
    meta: { sidebar: 'reactivos', contexto: 'proyectos' },
  },
]
