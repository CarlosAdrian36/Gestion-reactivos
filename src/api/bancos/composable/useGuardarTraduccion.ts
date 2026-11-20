import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { crearTraduccionReactivoAction } from '@/api/bancos/actions/crear-traduccion-reactivo.action'
import { crearTraduccionRespuestaAction } from '@/api/bancos/actions/crear-traduccion-respuesta.action'
import { deleteReactivoAction } from '@/api/bancos/actions/delete-reactivo.action'
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
      // 1. Crear la traducción del reactivo y capturar el id NUEVO que devuelve el backend.
      const resultadoReactivo = await crearTraduccionReactivoAction(idBanco, idReactivo, idioma, {
        descripcion,
      })
      const nuevoIdReactivo = resultadoReactivo.reactivo?.idReactivo
      if (!nuevoIdReactivo) {
        throw new Error('El backend no devolvió el id del reactivo traducido')
      }

      // 2. Crear las respuestas traducidas colgadas de ESE id nuevo.
      try {
        const resultadosRespuestas = await Promise.allSettled(
          respuestas.map(({ idRespuesta, esCorrecta, respuesta }) =>
            crearTraduccionRespuestaAction(idBanco, nuevoIdReactivo, idRespuesta, idioma, {
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
      } catch (error) {
        // 3. Rollback: si las respuestas fallaron, eliminar la traducción incompleta.
        try {
          await deleteReactivoAction(idBanco, nuevoIdReactivo)
        } catch (errorRollback) {
          throw new Error(
            `${
              error instanceof Error
                ? error.message
                : 'No se pudieron guardar todas las traducciones de las respuestas'
            }. No se pudo revertir la traducción incompleta: ${
              errorRollback instanceof Error ? errorRollback.message : 'error desconocido'
            }`,
          )
        }
        throw error instanceof Error
          ? error
          : new Error('No se pudieron guardar todas las traducciones de las respuestas')
      }
    },
    onSettled: async (_data, _error, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['reactivos', idBanco] }),
        queryClient.invalidateQueries({ queryKey: ['reactivos-proyecto', idBanco] }),
        queryClient.invalidateQueries({ queryKey: ['proyecto', idBanco] }),
        queryClient.invalidateQueries({ queryKey: ['respuestas', idBanco, variables.idReactivo] }),
        queryClient.invalidateQueries({
          queryKey: ['reactivo-idioma', idBanco, variables.idReactivo, variables.idioma],
        }),
      ])
    },
  })
}
