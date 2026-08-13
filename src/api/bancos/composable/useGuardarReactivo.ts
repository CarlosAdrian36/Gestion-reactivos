import { computed, onMounted, ref } from 'vue'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { getBancoById } from '@/api/bancos/actions/getBancoById.action'
import { crearReactivoAction } from '@/api/bancos/actions/crear-reactivo.action'
import { crearRespuestaAction } from '@/api/bancos/actions/crear-respuesta.action'
import { actualizarReactivoAction } from '@/api/bancos/actions/actualizar-reactivo.action'
import { actualizarRespuestaAction } from '@/api/bancos/actions/actualizar-respuesta.action'
import { eliminarRespuestaAction } from '@/api/bancos/actions/eliminar-respuesta.action'
import { useReactivosStore } from '@/app/bancos/reactivos/reactivosStore'

export const TIPO_REACTIVO = {
  opcionMultiple: 1,
  respuestaMultiple: 2,
  verdaderoFalso: 3,
  preguntaAbierta: 4,
  relacional: 5,
} as const

export interface OpcionForm {
  idRespuesta?: string
  texto: string
  correcta: boolean
}

export function useGuardarReactivo(bancoId: string, tipoReactivoId: number, idReactivo?: string) {
  const queryClient = useQueryClient()
  const router = useRouter()
  const idiomaId = ref(1)
  const reactivoCreado = ref<{ idReactivo: string } | null>(null)
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
    router.push({ name: 'reactivosList', params: { id: bancoId } })
  }

  const crearReactivoMutation = useMutation({
    mutationFn: (descripcion: string) =>
      crearReactivoAction(bancoId, {
        idiomaId: idiomaId.value,
        nivelCognitivoId: 1,
        subTemaId: 1,
        tipoReactivoId,
        descripcion,
      }),
    onSuccess: (data) => {
      reactivoCreado.value = data.reactivo
      toast.success('Reactivo creado. Ahora guarda las respuestas.')
      queryClient.invalidateQueries({ queryKey: ['reactivos', bancoId] })
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Error al crear el reactivo')
    },
  })

  const actualizarReactivoMutation = useMutation({
    mutationFn: (descripcion: string) =>
      actualizarReactivoAction(bancoId, idReactivo!, { tipoReactivoId, descripcion }),
    onSuccess: (_data, descripcion) => {
      const { selectedReactivo, select } = useReactivosStore()
      if (selectedReactivo.value) {
        select({ ...selectedReactivo.value, descripcion })
      }
      toast.success('Reactivo actualizado correctamente')
      queryClient.invalidateQueries({ queryKey: ['reactivos', bancoId] })
      volverALista()
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Error al actualizar el reactivo')
    },
  })

  const crearRespuestasMutation = useMutation({
    mutationFn: async (opciones: OpcionForm[]) => {
      const enviadas: boolean[] = []
      for (let i = 0; i < opciones.length; i++) {
        const opcion = opciones[i]!
        if (opcion.texto.trim().length === 0) continue
        console.error(i)
        const res = await crearRespuestaAction(bancoId, reactivoCreado.value!.idReactivo, {
          // idiomaId: idiomaId.value,
          posicion: i + 1,
          esCorrecta: opcion.correcta,
          respuesta: opcion.texto,
        })
        enviadas.push(res.respuestaCreada)
      }
      return enviadas
    },
    onSuccess: (enviadas) => {
      toast.success(`${enviadas.length} respuesta(s) guardada(s) correctamente`)
      queryClient.invalidateQueries({ queryKey: ['reactivos', bancoId] })
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Error al guardar las respuestas')
    },
  })

  const sincronizarRespuestasMutation = useMutation({
    mutationFn: async (payload: { opciones: OpcionForm[]; idsActuales: string[] }) => {
      const { opciones, idsActuales } = payload
      const idsConservados = opciones
        .filter((o) => o.idRespuesta)
        .map((o) => o.idRespuesta as string)
      const idsEliminar = idsActuales.filter((id) => !idsConservados.includes(id))

      for (const id of idsEliminar) {
        await eliminarRespuestaAction(bancoId, idReactivo!, id)
      }

      let posicion = idsActuales.length + 1
      for (const opcion of opciones) {
        if (opcion.texto.trim().length === 0) continue
        if (opcion.idRespuesta) {
          await actualizarRespuestaAction(bancoId, idReactivo!, opcion.idRespuesta, {
            esCorrecta: opcion.correcta,
            respuesta: opcion.texto,
          })
        } else {
          await crearRespuestaAction(bancoId, idReactivo!, {
            posicion: posicion++,
            esCorrecta: opcion.correcta,
            respuesta: opcion.texto,
          })
        }
      }
    },
    onSuccess: () => {
      toast.success('Respuestas actualizadas correctamente')
      queryClient.invalidateQueries({ queryKey: ['reactivos', bancoId] })
      queryClient.invalidateQueries({ queryKey: ['respuestas', bancoId, idReactivo] })
      volverALista()
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Error al guardar las respuestas')
    },
  })

  const guardarPregunta = (descripcion: string) => {
    if (esEdicion.value) actualizarReactivoMutation.mutate(descripcion)
    else crearReactivoMutation.mutate(descripcion)
  }

  const guardarRespuestas = (opciones: OpcionForm[], idsActuales: string[] = []) => {
    if (esEdicion.value) sincronizarRespuestasMutation.mutate({ opciones, idsActuales })
    else crearRespuestasMutation.mutate(opciones)
  }

  return {
    reactivoCreado,
    guardandoPregunta: computed(() =>
      esEdicion.value
        ? actualizarReactivoMutation.isPending.value
        : crearReactivoMutation.isPending.value,
    ),
    guardandoRespuestas: computed(() =>
      esEdicion.value
        ? sincronizarRespuestasMutation.isPending.value
        : crearRespuestasMutation.isPending.value,
    ),
    guardarPregunta,
    guardarRespuestas,
  }
}
