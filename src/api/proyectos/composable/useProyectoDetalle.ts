import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { getProyectoDetalleAction } from '@/api/proyectos/actions/get-proyecto-detalle.action'

export const useProyectoDetalle = (
  idProyecto: MaybeRefOrGetter<string>,
  enabled: MaybeRefOrGetter<boolean> = true,
) => {
  const proyectoId = computed(() => toValue(idProyecto))
  const queryEnabled = computed(() => toValue(enabled))

  return useQuery({
    queryKey: computed(() => ['proyecto', proyectoId.value] as const),
    queryFn: () => getProyectoDetalleAction(proyectoId.value),
    enabled: queryEnabled,
  })
}
