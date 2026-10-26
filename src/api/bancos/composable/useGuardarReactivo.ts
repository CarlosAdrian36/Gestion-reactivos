import { computed, onMounted, ref } from 'vue'
import { useQueryClient } from '@tanstack/vue-query'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { getBancoById } from '@/api/bancos/actions/getBancoById.action'
import { crearReactivoAction } from '@/api/bancos/actions/crear-reactivo.action'
import { crearRespuestaAction } from '@/api/bancos/actions/crear-respuesta.action'
import { actualizarReactivoAction } from '@/api/bancos/actions/actualizar-reactivo.action'
import { actualizarRespuestaAction } from '@/api/bancos/actions/actualizar-respuesta.action'
import { eliminarRespuestaAction } from '@/api/bancos/actions/eliminar-respuesta.action'
import { deleteReactivoAction } from '@/api/bancos/actions/delete-reactivo.action'
import { useReactivoSeleccionadoStore } from '@/app/bancos/reactivos/useReactivoSeleccionado'
import { useBancoNavigation } from '@/app/common/banco-navigation'
import { storeToRefs } from 'pinia'
import { TIPO_REACTIVO } from './useTiposReactivo'
import type { Reactivo } from '../interfaces/reactivo.interface'

export { TIPO_REACTIVO }

export interface OpcionForm {
  idRespuesta?: string
  texto: string
  correcta: boolean
}

async function ejecutarEnParalelo(operaciones: Promise<unknown>[], mensajeError: string) {
  const resultados = await Promise.allSettled(operaciones)
  const resultadoFallido = resultados.find((resultado) => resultado.status === 'rejected')

  if (resultadoFallido?.status === 'rejected') {
    throw resultadoFallido.reason instanceof Error
      ? resultadoFallido.reason
      : new Error(mensajeError)
  }
}

function obtenerMensajeError(error: unknown, mensajeAlternativo: string): string {
  return error instanceof Error ? error.message : mensajeAlternativo
}

export function useGuardarReactivo(bancoId: string, tipoReactivoId: number, idReactivo?: string) {
  const queryClient = useQueryClient()
  const router = useRouter()
  const { routeNames } = useBancoNavigation()
  const idiomaId = ref(1)
  const isGuardando = ref(false)
  const esEdicion = computed(() => Boolean(idReactivo))

  onMounted(async () => {
    try {
      const banco = await getBancoById(bancoId)
      idiomaId.value = banco.idiomas[0]?.idiomaId ?? 1
    } catch {
      idiomaId.value = 1
    }
  })

  const volverALista = () => {
    router.push({ name: routeNames.value.reactivos, params: { id: bancoId } })
  }

  const refrescarReactivos = async () => {
    await queryClient.invalidateQueries({ queryKey: ['reactivos', bancoId] })
    await queryClient.refetchQueries({ queryKey: ['reactivos', bancoId] })
  }

  const seleccionarReactivoActualizado = (id: string, descripcion?: string) => {
    const lista = queryClient.getQueryData<Reactivo[]>(['reactivos', bancoId])
    const reactivosStore = useReactivoSeleccionadoStore()
    const { selectedReactivo } = storeToRefs(reactivosStore)
    const reactivoActualizado = lista?.find((reactivo) => reactivo.idReactivo === id)

    if (reactivoActualizado) {
      reactivosStore.select(reactivoActualizado)
    } else if (descripcion && selectedReactivo.value) {
      reactivosStore.select({ ...selectedReactivo.value, descripcion })
    }
  }

  const crearRespuestas = async (id: string, opciones: OpcionForm[]) => {
    const opcionesConTexto = opciones
      .map((opcion, index) => ({ opcion, posicion: index + 1 }))
      .filter(({ opcion }) => opcion.texto.trim().length > 0)

    await ejecutarEnParalelo(
      opcionesConTexto.map(({ opcion, posicion }) =>
        crearRespuestaAction(bancoId, id, {
          posicion,
          esCorrecta: opcion.correcta,
          respuesta: opcion.texto,
        }),
      ),
      'Error al guardar las respuestas',
    )

    return opcionesConTexto.length
  }

  const sincronizarRespuestas = async (
    idReactivoActual: string,
    opciones: OpcionForm[],
    idsActuales: string[],
  ) => {
    const idsConservados = new Set(
      opciones.flatMap((opcion) => (opcion.idRespuesta ? [opcion.idRespuesta] : [])),
    )
    const idsEliminar = idsActuales.filter((id) => !idsConservados.has(id))

    await ejecutarEnParalelo(
      idsEliminar.map((idRespuesta) =>
        eliminarRespuestaAction(bancoId, idReactivoActual, idRespuesta),
      ),
      'Error al eliminar las respuestas',
    )

    const opcionesExistentes = opciones.filter(
      (opcion) => opcion.idRespuesta && opcion.texto.trim().length > 0,
    )
    await ejecutarEnParalelo(
      opcionesExistentes.map((opcion) =>
        actualizarRespuestaAction(bancoId, idReactivoActual, opcion.idRespuesta!, {
          esCorrecta: opcion.correcta,
          respuesta: opcion.texto,
        }),
      ),
      'Error al actualizar las respuestas',
    )

    let posicion = idsActuales.length + 1
    const opcionesNuevas = opciones.filter(
      (opcion) => !opcion.idRespuesta && opcion.texto.trim().length > 0,
    )
    await ejecutarEnParalelo(
      opcionesNuevas.map((opcion) =>
        crearRespuestaAction(bancoId, idReactivoActual, {
          posicion: posicion++,
          esCorrecta: opcion.correcta,
          respuesta: opcion.texto,
        }),
      ),
      'Error al crear las respuestas nuevas',
    )
  }

  const guardarTodo = async (
    descripcion: string,
    opciones?: OpcionForm[],
    idsActuales: string[] = [],
  ): Promise<boolean> => {
    const descripcionLimpia = descripcion.trim()
    if (!descripcionLimpia) {
      toast.error('La pregunta no puede estar vacía')
      return false
    }

    isGuardando.value = true
    try {
      if (esEdicion.value && idReactivo) {
        await actualizarReactivoAction(bancoId, idReactivo, {
          tipoReactivoId,
          descripcion,
        })

        if (opciones) {
          await sincronizarRespuestas(idReactivo, opciones, idsActuales)
        }

        await refrescarReactivos()
        seleccionarReactivoActualizado(idReactivo, descripcion)
        await queryClient.invalidateQueries({ queryKey: ['respuestas', bancoId, idReactivo] })
        toast.success('Reactivo actualizado correctamente')
      } else {
        const respuestaCreacion = await crearReactivoAction(bancoId, {
          idiomaId: idiomaId.value,
          nivelCognitivoId: 1,
          subTemaId: 1,
          tipoReactivoId,
          descripcion,
        })
        const nuevoIdReactivo = respuestaCreacion.reactivo.idReactivo
        let cantidadRespuestas = 0

        if (opciones?.length) {
          try {
            cantidadRespuestas = await crearRespuestas(nuevoIdReactivo, opciones)
          } catch (error) {
            try {
              await deleteReactivoAction(bancoId, nuevoIdReactivo)
            } catch (errorRollback) {
              throw new Error(
                `${obtenerMensajeError(error, 'Error al guardar las respuestas')}. ` +
                  `No se pudo revertir el reactivo incompleto: ${obtenerMensajeError(errorRollback, 'error desconocido')}`,
              )
            }
            throw error
          }
        }

        await refrescarReactivos()
        seleccionarReactivoActualizado(nuevoIdReactivo, descripcion)
        toast.success(
          opciones?.length
            ? `Reactivo y ${cantidadRespuestas} respuesta(s) guardados correctamente`
            : 'Reactivo creado correctamente',
        )
      }

      volverALista()
      return true
    } catch (error) {
      toast.error(obtenerMensajeError(error, 'Error al guardar el reactivo'))
      await queryClient.invalidateQueries({ queryKey: ['reactivos', bancoId] })
      return false
    } finally {
      isGuardando.value = false
    }
  }

  return {
    isGuardando,
    guardarTodo,
  }
}
