import { useQuery } from '@tanstack/vue-query'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { getRespuestasAction } from '../actions/get-respuestas.action'

export function useRespuestas(
  bancoId: string,
  idReactivo: MaybeRefOrGetter<string | undefined>,
  idioma?: MaybeRefOrGetter<string | undefined>,
) {
  const reactivoId = computed(() => toValue(idReactivo))
  const idiomaSeleccionado = computed(() => toValue(idioma))
  return useQuery({
    queryKey: computed(
      () => ['respuestas', bancoId, reactivoId.value, idiomaSeleccionado.value] as const,
    ),
    queryFn: () => getRespuestasAction(bancoId, reactivoId.value!, idiomaSeleccionado.value),
    enabled: computed(() => !!reactivoId.value),
    staleTime: 1000 * 60,
    refetchOnWindowFocus: true,
  })
}
