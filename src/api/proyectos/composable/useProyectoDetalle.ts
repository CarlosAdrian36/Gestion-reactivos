import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { getProyectoDetalleAction } from '@/api/proyectos/actions/get-proyecto-detalle.action'

export const useProyectoDetalle = (idProyecto: MaybeRefOrGetter<string>) => {
  const proyectoId = computed(() => toValue(idProyecto))

  return useQuery({
    queryKey: computed(() => ['proyecto', proyectoId.value] as const),
    queryFn: () => getProyectoDetalleAction(proyectoId.value),
  })
}
