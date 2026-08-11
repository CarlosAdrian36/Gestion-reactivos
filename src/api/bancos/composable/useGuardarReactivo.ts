import { computed, onMounted, ref } from 'vue'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { getBancoById } from '@/api/bancos/actions/getBancoById.action'
import { crearReactivoAction } from '@/api/bancos/actions/crear-reactivo.action'
import { crearRespuestaAction } from '@/api/bancos/actions/crear-respuesta.action'

export const TIPO_REACTIVO = {
  opcionMultiple: 1,
  respuestaMultiple: 2,
  verdaderoFalso: 3,
  preguntaAbierta: 4,
  relacional: 5,
} as const

export function useGuardarReactivo(bancoId: string, tipoReactivoId: number) {
  const queryClient = useQueryClient()
  const idiomaId = ref(1)
  const reactivoCreado = ref<{ idReactivo: string } | null>(null)

  onMounted(async () => {
    try {
      const banco = await getBancoById(bancoId)
      idiomaId.value = banco.idiomas[0]?.idiomaId ?? 1
    } catch {
      idiomaId.value = 1
    }
  })

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

  const crearRespuestasMutation = useMutation({
    mutationFn: async (opciones: { texto: string; correcta: boolean }[]) => {
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

  return {
    reactivoCreado,
    guardandoPregunta: computed(() => crearReactivoMutation.isPending.value),
    guardandoRespuestas: computed(() => crearRespuestasMutation.isPending.value),
    guardarPregunta: (descripcion: string) => crearReactivoMutation.mutate(descripcion),
    guardarRespuestas: (opciones: { texto: string; correcta: boolean }[]) =>
      crearRespuestasMutation.mutate(opciones),
  }
}
