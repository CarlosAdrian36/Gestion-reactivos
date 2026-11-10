import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { crearTraduccionReactivoAction } from '@/api/bancos/actions/crear-traduccion-reactivo.action'
import { crearTraduccionRespuestaAction } from '@/api/bancos/actions/crear-traduccion-respuesta.action'
import type { RespuestaTraduccionInput } from '@/api/bancos/interfaces/traduccion.interface'

interface GuardarTraduccionVariables {
  idReactivo: string
  idioma: string
  descripcion: string
  respuestas: RespuestaTraduccionInput[]
}

export function useGuardarTraduccion(idBanco: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['crear-traduccion-reactivo', idBanco],
    mutationFn: async ({
      idReactivo,
      idioma,
      descripcion,
      respuestas,
    }: GuardarTraduccionVariables) => {
      const resultadoReactivo = await crearTraduccionReactivoAction(
        idBanco,
        idReactivo,
        idioma,
        { descripcion },
      )

      const resultadosRespuestas = await Promise.allSettled(
        respuestas.map(({ idRespuesta, esCorrecta, respuesta }) =>
          crearTraduccionRespuestaAction(idBanco, idReactivo, idRespuesta, idioma, {
            esCorrecta,
            respuesta,
          }),
        ),
      )
      const respuestaFallida = resultadosRespuestas.find(
        (resultado) => resultado.status === 'rejected',
      )

      if (respuestaFallida?.status === 'rejected') {
        throw respuestaFallida.reason instanceof Error
          ? respuestaFallida.reason
          : new Error('No se pudieron guardar todas las traducciones de las respuestas')
      }

      return {
        reactivo: resultadoReactivo.reactivo,
        respuestas: resultadosRespuestas.flatMap((resultado) =>
          resultado.status === 'fulfilled' ? [resultado.value.respuesta] : [],
        ),
      }
    },
    onSettled: async (_data, _error, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['reactivos', idBanco] }),
        queryClient.invalidateQueries({ queryKey: ['reactivos-proyecto', idBanco] }),
        queryClient.invalidateQueries({ queryKey: ['proyecto', idBanco] }),
        queryClient.invalidateQueries({
          queryKey: ['respuestas', idBanco, variables.idReactivo],
        }),
      ])
    },
  })
}
