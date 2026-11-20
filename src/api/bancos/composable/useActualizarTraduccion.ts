import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { actualizarReactivoAction } from '@/api/bancos/actions/actualizar-reactivo.action'
import { actualizarRespuestaAction } from '@/api/bancos/actions/actualizar-respuesta.action'

interface RespuestaActualizacionInput {
  idRespuesta: string
  esCorrecta: boolean
  respuesta: string
}

interface ActualizarTraduccionVariables {
  /** Id del reactivo ORIGINAL (para invalidar la query reactivo-idioma). */
  idReactivoOriginal: string
  /** Id del reactivo TRADUCIDO (sobre el que se hace el PUT). */
  idReactivoTraducido: string
  idioma: string
  tipoReactivoId: number
  descripcion: string
  respuestas: RespuestaActualizacionInput[]
}

export function useActualizarTraduccion(idBanco: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['actualizar-traduccion-reactivo', idBanco],
    mutationFn: async ({
      idReactivoTraducido,
      idioma,
      tipoReactivoId,
      descripcion,
      respuestas,
    }: ActualizarTraduccionVariables) => {
      await actualizarReactivoAction(
        idBanco,
        idReactivoTraducido,
        { tipoReactivoId, descripcion },
        idioma,
      )

      const resultadosRespuestas = await Promise.allSettled(
        respuestas.map(({ idRespuesta, esCorrecta, respuesta }) =>
          actualizarRespuestaAction(
            idBanco,
            idReactivoTraducido,
            idRespuesta,
            { esCorrecta, respuesta },
            idioma,
          ),
        ),
      )
      const respuestaFallida = resultadosRespuestas.find(
        (resultado) => resultado.status === 'rejected',
      )

      if (respuestaFallida?.status === 'rejected') {
        throw respuestaFallida.reason instanceof Error
          ? respuestaFallida.reason
          : new Error('No se pudieron actualizar todas las traducciones de las respuestas')
      }

      return { actualizado: true }
    },
    onSettled: async (_data, _error, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['reactivo-idioma', idBanco, variables.idReactivoOriginal, variables.idioma],
        }),
        queryClient.invalidateQueries({
          queryKey: ['respuestas', idBanco, variables.idReactivoTraducido],
        }),
      ])
    },
  })
}
