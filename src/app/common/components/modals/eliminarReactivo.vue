<template>
  <header class="flex items-center justify-between p-6 border-b border-gray-100">
    <div class="flex items-center gap-3">
      <!-- Warning Icon (Triangle with Exclamation) -->
      <div class="text-rose-500">
        <i class="fa-solid fa-triangle-exclamation text-3xl"></i>
      </div>
      <h2 class="text-xl font-bold text-slate-800">Eliminar Reactivo</h2>
    </div>
  </header>
  <main class="p-4 flex flex-col items-center text-center">
    <div class="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-6">
      <i class="fa-regular fa-trash text-5xl text-error"></i>
    </div>
    <h3 class="text-xl font-bold text-slate-900 mb-6 leading-snug max-w-sm">
      ¿Estás seguro que deseas eliminar el reactivo
      <span class="text-rose-600"> #{{ props.reactivo.posicion }} </span>?
    </h3>
    <div
      class="warning-box rounded-lg p-4 flex items-start gap-4 text-left w-full mb-8 bg-rose-100/50"
    >
      <div class="mt-1">
        <i class="fa-regular fa-circle-info"></i>
      </div>
      <p class="text-slate-700 text-sm leading-relaxed">
        Esta acción eliminará el reactivo junto con sus respuestas. Esta acción no se puede
        deshacer.
      </p>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { deleteReactivoAction } from '@/api/bancos/actions/delete-reactivo.action'
import type { Reactivo } from '@/api/bancos/interfaces/reactivo.interface'
import { useModalStore } from '@/common/modals/store/modal.store'
import { useReactivoSeleccionadoStore } from '@/app/bancos/reactivos/useReactivoSeleccionado'
import { useQueryClient } from '@tanstack/vue-query'
import { onMounted, onUnmounted } from 'vue'
import { toast } from 'vue-sonner'

const modal = useModalStore()
const queryClient = useQueryClient()
const { clear } = useReactivoSeleccionadoStore()

const props = defineProps<{
  bancoId: string
  reactivo: Reactivo
}>()

const onSubmit = async () => {
  try {
    await deleteReactivoAction(props.bancoId, props.reactivo.idReactivo)
    toast.success('Se eliminó el reactivo correctamente')
    clear()
    await queryClient.invalidateQueries({
      queryKey: ['reactivos', props.bancoId],
    })
    modal.closeModal()
  } catch (error) {
    toast.error(error instanceof Error ? error.message : 'Error al eliminar el reactivo')
  }
}
onMounted(() => {
  modal.setSubmitFN(onSubmit)
})

onUnmounted(() => {
  modal.setSubmitFN(null)
})
</script>
