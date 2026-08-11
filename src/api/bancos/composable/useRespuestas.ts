import { useQuery } from '@tanstack/vue-query'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { getRespuestasAction } from '../actions/get-respuestas.action'

export function useRespuestas(
  bancoId: string,
  idReactivo: MaybeRefOrGetter<string | undefined>,
) {
  const reactivoId = computed(() => toValue(idReactivo))
  return useQuery({
    queryKey: ['respuestas', bancoId, reactivoId],
    queryFn: () => getRespuestasAction(bancoId, reactivoId.value!),
    enabled: computed(() => !!reactivoId.value),
  })
}
