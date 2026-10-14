import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { apiClient } from '@/api/http'
import {
  normalizarReactivo,
  type Reactivo,
  type ReactivoProyecto,
} from '@/api/bancos/interfaces/reactivo.interface'

/**
 * Consulta los reactivos de un proyecto reutilizando el mismo endpoint
 * de bancos (`/bancos/:id/reactivos`). El backend devuelve los campos
 * extra `hallazgos` y `estado` cuando el id corresponde a un proyecto.
 */
export const useReactivosProyecto = (proyectoId: MaybeRefOrGetter<string>) => {
  const id = computed(() => toValue(proyectoId))

  return useQuery({
    queryKey: computed(() => ['reactivos-proyecto', id.value] as const),
    queryFn: async (): Promise<ReactivoProyecto[]> => {
      const { data } = await apiClient.get<{ reactivos: Reactivo[] }>(
        `/bancos/${id.value}/reactivos`,
      )
      return (data.reactivos ?? []).map(normalizarReactivo)
    },
    staleTime: 1000 * 60,
    refetchOnWindowFocus: true,
  })
}