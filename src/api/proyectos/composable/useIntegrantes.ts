import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { getIntegrantesAction } from '@/api/proyectos/actions/get-integrantes.action'

export const useIntegrantes = (idProyecto: MaybeRefOrGetter<string>) => {
  const id = computed(() => toValue(idProyecto))

  return useQuery({
    queryKey: computed(() => ['integrantes-proyecto', id.value] as const),
    queryFn: () => getIntegrantesAction(id.value),
    staleTime: 1000 * 60,
    refetchOnWindowFocus: true,
  })
}