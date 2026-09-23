import { computed } from 'vue'
import { useRoute } from 'vue-router'

const misBancosRouteNames = {
  home: 'misBancos',
  detail: 'bancoDetalle',
  reactivos: 'reactivosList',
  create: 'crearReactivo',
  edit: 'editarReactivo',
} as const

const proyectosRouteNames = {
  home: 'proyectos',
  detail: 'proyectoBancoDetalle',
  reactivos: 'proyectoReactivosList',
  create: 'proyectoCrearReactivo',
  edit: 'proyectoEditarReactivo',
} as const

export function useBancoNavigation() {
  const route = useRoute()

  const routeNames = computed(() =>
    route.meta.contexto === 'proyectos' ? proyectosRouteNames : misBancosRouteNames,
  )

  return { routeNames }
}
