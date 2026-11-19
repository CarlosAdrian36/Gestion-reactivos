import { useQuery } from '@tanstack/vue-query'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { getReactivoAction } from '../actions/get-reactivo.action'

/** Consulta un reactivo en un idioma específico (devuelve `null` si no hay traducción). */
export function useReactivoIdioma(
  bancoId: MaybeRefOrGetter<string>,
  idReactivo: MaybeRefOrGetter<string | undefined>,
  idioma: MaybeRefOrGetter<string | undefined>,
  enabled: MaybeRefOrGetter<boolean> = true,
) {
  const idBanco = computed(() => toValue(bancoId))
  const reactivoId = computed(() => toValue(idReactivo))
  const idiomaSeleccionado = computed(() => toValue(idioma))
  const queryEnabled = computed(
    () => toValue(enabled) && !!reactivoId.value && !!idiomaSeleccionado.value,
  )

  return useQuery({
    queryKey: computed(
      () => ['reactivo-idioma', idBanco.value, reactivoId.value, idiomaSeleccionado.value] as const,
    ),
    queryFn: () => getReactivoAction(idBanco.value, reactivoId.value!, idiomaSeleccionado.value!),
    enabled: queryEnabled,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: true,
  })
}
