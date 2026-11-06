import { useQuery } from '@tanstack/vue-query'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { getInstruccionesGruposAction } from '../actions/get-instrucciones-grupos.action'

export function useInstruccionesGrupos(
  bancoId: string,
  enabled: MaybeRefOrGetter<boolean> = true,
) {
  const queryEnabled = computed(() => toValue(enabled))

  return useQuery({
    queryKey: ['instruccionesGrupos', bancoId],
    queryFn: () => getInstruccionesGruposAction(bancoId),
    enabled: queryEnabled,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: true,
  })
}
