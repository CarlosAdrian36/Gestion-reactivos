import { useQueries } from '@tanstack/vue-query'
import { computed, type MaybeRefOrGetter, toValue } from 'vue'
import { getRespuestasAction } from '../actions/get-respuestas.action'
import type { Respuesta } from '../interfaces/respuesta.interface'

export function useRespuestasGrupo(
  bancoId: string,
  reactivoIds: MaybeRefOrGetter<string[]>,
) {
  const ids = computed(() => toValue(reactivoIds))

  const queries = useQueries({
    queries: computed(() =>
      ids.value.map((id) => ({
        queryKey: ['respuestas', bancoId, id],
        queryFn: () => getRespuestasAction(bancoId, id),
        enabled: !!id,
      })),
    ),
  })

  const isLoading = computed(() => queries.value.some((q) => q.isLoading))

  const respuestasMap = computed<Map<string, Respuesta[]>>(() => {
    const map = new Map<string, Respuesta[]>()
    ids.value.forEach((id, index) => {
      const data = queries.value[index]?.data
      map.set(id, data ?? [])
    })
    return map
  })

  return { respuestasMap, isLoading }
}
