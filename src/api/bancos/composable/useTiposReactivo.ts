import { computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { getTiposReactivoAction } from '../actions/get-tipos-reactivo.action'
import type {
  TipoReactivoInfo,
  TipoReactivoSlug,
} from '../interfaces/tipo-reactivo.interface'

export const TIPO_REACTIVO = {
  opcionMultiple: 1,
  respuestaMultiple: 2,
  verdaderoFalso: 3,
  preguntaAbierta: 4,
  relacional: 5,
} as const

const METADATA_TIPOS: Record<number, { id: TipoReactivoSlug; descripcion: string; icono: string }> =
  {
    1: {
      id: 'opcion-multiple',
      descripcion: 'Seleccionar una opción correcta entre varias',
      icono: 'fa-regular fa-list-check',
    },
    2: {
      id: 'respuesta-multiple',
      descripcion: 'Seleccionar varias opciones correctas',
      icono: 'fa-regular fa-rectangle-list',
    },
    3: {
      id: 'verdadero-falso',
      descripcion: 'Determinar si una afirmación es verdadera o falsa',
      icono: 'fa-regular fa-toggle-on',
    },
    4: {
      id: 'pregunta-abierta',
      descripcion: 'Respuesta libre y abierta',
      icono: 'fa-regular fa-comment-lines',
    },
    5: {
      id: 'relacional',
      descripcion: 'Relacionar elementos de dos columnas',
      icono: 'fa-regular fa-arrow-right-arrow-left',
    },
  }

export function useTiposReactivo() {
  const query = useQuery({
    queryKey: ['tiposReactivo'],
    queryFn: getTiposReactivoAction,
    staleTime: 1000 * 60 * 5,
  })

  const tipos = computed<TipoReactivoInfo[]>(() =>
    (query.data.value ?? [])
      .map((t) => ({ ...t, ...METADATA_TIPOS[t.tipoReactivoId] }))
      .filter((t): t is TipoReactivoInfo => Boolean(t.id)),
  )

  const tipoPorId = (id: number): TipoReactivoInfo | undefined =>
    tipos.value.find((t) => t.tipoReactivoId === id)

  return { ...query, tipos, tipoPorId }
}
