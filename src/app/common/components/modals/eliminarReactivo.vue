<template>
  <header class="flex items-center justify-between p-6 border-b border-gray-100">
    <div class="flex items-center gap-3">
      <!-- Warning Icon (Triangle with Exclamation) -->
      <div class="text-rose-500">
        <i class="fa-solid fa-triangle-exclamation text-3xl"></i>
      </div>
      <h2 class="text-xl font-bold text-slate-800">
        {{ esTraduccion ? 'Eliminar Traducción' : esRelacional ? 'Eliminar Grupo' : 'Eliminar Reactivo' }}
      </h2>
    </div>
  </header>
  <main class="p-4 flex flex-col items-center text-center">
    <div class="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-6">
      <i class="fa-regular fa-trash text-5xl text-error"></i>
    </div>
    <h3 class="text-xl font-bold text-slate-900 mb-6 leading-snug max-w-sm">
      <template v-if="esTraduccion">
        ¿Estás seguro que deseas eliminar la traducción en
        <span class="text-rose-600">{{ props.traduccion?.idioma }}</span> del reactivo
        <span class="text-rose-600"> #{{ props.reactivo.posicion }} </span>?
      </template>
      <template v-else-if="esRelacional">
        ¿Estás seguro que deseas eliminar el grupo
        <span class="text-rose-600"> #{{ props.reactivo.posicion }} </span>?
      </template>
      <template v-else>
        ¿Estás seguro que deseas eliminar el reactivo
        <span class="text-rose-600"> #{{ props.reactivo.posicion }} </span>?
      </template>
    </h3>
    <div
      class="warning-box rounded-lg p-4 flex items-start gap-4 text-left w-full mb-8 bg-rose-100/50"
    >
      <div class="mt-1">
        <i class="fa-regular fa-circle-info"></i>
      </div>
      <p class="text-slate-700 text-sm leading-relaxed">
        <template v-if="esTraduccion">
          Esta acción eliminará únicamente la traducción en {{ props.traduccion?.idioma }}. El
          reactivo original no se verá afectado. Esta acción no se puede deshacer.
        </template>
        <template v-else-if="esRelacional">
          Esta acción eliminará el grupo completo con todos sus reactivos y respuestas. Esta
          acción no se puede deshacer.
        </template>
        <template v-else>
          Esta acción eliminará el reactivo junto con sus respuestas. Esta acción no se puede
          deshacer.
        </template>
      </p>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { deleteReactivoAction } from '@/api/bancos/actions/delete-reactivo.action'
import { eliminarGrupoAction } from '@/api/bancos/actions/eliminar-grupo.action'
import type { Reactivo } from '@/api/bancos/interfaces/reactivo.interface'
import { useModalStore } from '@/common/modals/store/modal.store'
import { useReactivoSeleccionadoStore } from '@/app/bancos/reactivos/useReactivoSeleccionado'
import { useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'

const modal = useModalStore()
const queryClient = useQueryClient()
const { clear } = useReactivoSeleccionadoStore()

const props = defineProps<{
  bancoId: string
  reactivo: Reactivo
  /** Si viene, se elimina SOLO la traducción (no el reactivo completo). */
  traduccion?: { idReactivo: string; idioma: string }
}>()

const esTraduccion = computed(() => !!props.traduccion)

// Relacional (tipo 5): se elimina el grupo completo, no un solo reactivo.
const esRelacional = computed(() => props.reactivo.tipoReactivoId === 5)

const onSubmit = async () => {
  try {
    if (esTraduccion.value) {
      // Eliminar traducción: borra el reactivo traducido.
      const result = await deleteReactivoAction(
        props.bancoId,
        props.traduccion!.idReactivo,
        undefined,
      )
      if (!result.reactivoEliminado) {
        toast.error('No se pudo eliminar la traducción')
        return
      }
      toast.success('Se eliminó la traducción correctamente')
      await queryClient.invalidateQueries({
        queryKey: [
          'reactivo-idioma',
          props.bancoId,
          props.reactivo.idReactivo,
          props.traduccion!.idioma,
        ],
      })
    } else if (esRelacional.value) {
      // Eliminar el grupo relacional completo.
      const result = await eliminarGrupoAction(props.bancoId, props.reactivo.grupo)
      if (!result.grupoEliminado) {
        toast.error('No se pudo eliminar el grupo')
        return
      }
      toast.success('Se eliminó el grupo correctamente')
      clear()
      await queryClient.invalidateQueries({ queryKey: ['reactivos', props.bancoId] })
      await queryClient.invalidateQueries({ queryKey: ['reactivos-proyecto', props.bancoId] })
      await queryClient.invalidateQueries({ queryKey: ['instruccionesGrupos', props.bancoId] })
    } else {
      // Eliminar reactivo individual.
      const result = await deleteReactivoAction(
        props.bancoId,
        props.reactivo.idReactivo,
        props.reactivo.grupo,
      )
      if (!result.reactivoEliminado) {
        toast.error('No se pudo eliminar el reactivo')
        return
      }
      toast.success('Se eliminó el reactivo correctamente')
      clear()
      await queryClient.invalidateQueries({ queryKey: ['reactivos', props.bancoId] })
      await queryClient.invalidateQueries({ queryKey: ['reactivos-proyecto', props.bancoId] })
    }
    modal.closeModal()
  } catch (error) {
    toast.error(error instanceof Error ? error.message : 'Error al eliminar')
  }
}
onMounted(() => {
  modal.setSubmitFN(onSubmit)
})

onUnmounted(() => {
  modal.setSubmitFN(null)
})
</script>
