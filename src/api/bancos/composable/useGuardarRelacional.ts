import { ref, computed } from 'vue'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { getBancoById } from '@/api/bancos/actions/getBancoById.action'
import { crearReactivoAction } from '@/api/bancos/actions/crear-reactivo.action'
import { actualizarReactivoAction } from '@/api/bancos/actions/actualizar-reactivo.action'
import { deleteReactivoAction } from '@/api/bancos/actions/delete-reactivo.action'
import { crearRespuestaAction } from '@/api/bancos/actions/crear-respuesta.action'
import { actualizarRespuestaAction } from '@/api/bancos/actions/actualizar-respuesta.action'
import { eliminarRespuestaAction } from '@/api/bancos/actions/eliminar-respuesta.action'
import { crearInstruccionGrupoAction } from '@/api/bancos/actions/crear-instruccion-grupo.action'
import { actualizarInstruccionGrupoAction } from '@/api/bancos/actions/actualizar-instruccion-grupo.action'
import { TIPO_REACTIVO } from './useTiposReactivo'

export interface ReactivoRelacionalForm {
  idReactivo?: string
  descripcion: string
  respuestas: RespuestaRelacionalForm[]
}

export interface RespuestaRelacionalForm {
  idRespuesta?: string
  texto: string
  correcta: boolean
}

export function useGuardarRelacional(bancoId: string, grupoId?: number) {
  const queryClient = useQueryClient()
  const router = useRouter()
  const idiomaId = ref(1)
  const isGuardando = ref(false)
  const esEdicion = computed(() => grupoId != null && grupoId > 0)

  getBancoById(bancoId)
    .then((banco) => {
      idiomaId.value = banco.idiomas[0]?.idiomaId ?? 1
    })
    .catch(() => {
      idiomaId.value = 1
    })

  const volverALista = () => {
    router.push({ name: 'reactivosList', params: { id: bancoId } })
  }

  async function crearGrupo(instruccion: string, reactivos: ReactivoRelacionalForm[]) {
    const res = await crearInstruccionGrupoAction(bancoId, { descripcion: instruccion })
    const nuevoGrupoId = res.instruccion.grupo

    for (let i = 0; i < reactivos.length; i++) {
      const reactivo = reactivos[i]!
      if (!reactivo.descripcion.trim()) continue

      const reactivoRes = await crearReactivoAction(bancoId, {
        idiomaId: idiomaId.value,
        nivelCognitivoId: 1,
        subTemaId: 1,
        tipoReactivoId: TIPO_REACTIVO.relacional,
        descripcion: reactivo.descripcion,
        idGrupo: nuevoGrupoId,
      })

      for (let j = 0; j < reactivo.respuestas.length; j++) {
        const respuesta = reactivo.respuestas[j]!
        if (!respuesta.texto.trim()) continue
        await crearRespuestaAction(bancoId, reactivoRes.reactivo.idReactivo, {
          posicion: j + 1,
          esCorrecta: respuesta.correcta,
          respuesta: respuesta.texto,
        })
      }
    }
  }

  async function actualizarGrupo(
    idGrupo: number,
    instruccion: string,
    reactivos: ReactivoRelacionalForm[],
    idsReactivoActuales: string[],
  ) {
    await actualizarInstruccionGrupoAction(bancoId, idGrupo, { descripcion: instruccion })

    const idsConservados = reactivos
      .filter((r) => r.idReactivo)
      .map((r) => r.idReactivo as string)
    const idsEliminar = idsReactivoActuales.filter((id) => !idsConservados.includes(id))

    for (const id of idsEliminar) {
      await deleteReactivoAction(bancoId, id, idGrupo)
    }

    for (let i = 0; i < reactivos.length; i++) {
      const reactivo = reactivos[i]!
      if (!reactivo.descripcion.trim()) continue

      let idReactivo: string

      if (reactivo.idReactivo) {
        await actualizarReactivoAction(bancoId, reactivo.idReactivo, {
          tipoReactivoId: TIPO_REACTIVO.relacional,
          descripcion: reactivo.descripcion,
        })
        idReactivo = reactivo.idReactivo
      } else {
        const res = await crearReactivoAction(bancoId, {
          idiomaId: idiomaId.value,
          nivelCognitivoId: 1,
          subTemaId: 1,
          tipoReactivoId: TIPO_REACTIVO.relacional,
          descripcion: reactivo.descripcion,
          idGrupo,
        })
        idReactivo = res.reactivo.idReactivo
      }

      await syncRespuestas(bancoId, idReactivo, reactivo.respuestas)
    }
  }

  async function syncRespuestas(
    idBanco: string,
    idReactivo: string,
    respuestas: RespuestaRelacionalForm[],
  ) {
    const respuestasExistentes = await import('../actions/get-respuestas.action').then((m) =>
      m.getRespuestasAction(idBanco, idReactivo),
    )

    const idsExistentes = respuestasExistentes.map((r) => r.idRespuesta)
    const idsConservados = respuestas
      .filter((r) => r.idRespuesta)
      .map((r) => r.idRespuesta as string)
    const idsEliminar = idsExistentes.filter((id) => !idsConservados.includes(id))

    for (const id of idsEliminar) {
      await eliminarRespuestaAction(idBanco, idReactivo, id)
    }

    let posicion = respuestasExistentes.length + 1
    for (const respuesta of respuestas) {
      if (!respuesta.texto.trim()) continue
      if (respuesta.idRespuesta) {
        await actualizarRespuestaAction(idBanco, idReactivo, respuesta.idRespuesta, {
          esCorrecta: respuesta.correcta,
          respuesta: respuesta.texto,
        })
      } else {
        await crearRespuestaAction(idBanco, idReactivo, {
          posicion: posicion++,
          esCorrecta: respuesta.correcta,
          respuesta: respuesta.texto,
        })
      }
    }
  }

  const guardarGrupoMutation = useMutation({
    mutationFn: async (payload: {
      instruccion: string
      reactivos: ReactivoRelacionalForm[]
      idsReactivoActuales?: string[]
    }) => {
      if (esEdicion.value && grupoId) {
        await actualizarGrupo(
          grupoId,
          payload.instruccion,
          payload.reactivos,
          payload.idsReactivoActuales ?? [],
        )
      } else {
        await crearGrupo(payload.instruccion, payload.reactivos)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reactivos', bancoId] })
      queryClient.invalidateQueries({ queryKey: ['instruccionesGrupos', bancoId] })
      toast.success(esEdicion.value ? 'Grupo actualizado correctamente' : 'Grupo creado correctamente')
      volverALista()
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Error al guardar el grupo')
    },
  })

  async function guardarGrupo(
    instruccion: string,
    reactivos: ReactivoRelacionalForm[],
    idsReactivoActuales?: string[],
  ): Promise<boolean> {
    isGuardando.value = true
    try {
      await guardarGrupoMutation.mutateAsync({ instruccion, reactivos, idsReactivoActuales })
      return true
    } catch {
      return false
    } finally {
      isGuardando.value = false
    }
  }

  return {
    isGuardando,
    esEdicion,
    guardarGrupo,
  }
}
