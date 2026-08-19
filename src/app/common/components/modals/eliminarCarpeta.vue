<template>
  <header class="flex items-center justify-between p-6 border-b border-gray-100">
    <div class="flex items-center gap-3">
      <!-- Warning Icon (Triangle with Exclamation) -->
      <div class="text-rose-500">
        <i class="fa-solid fa-triangle-exclamation text-3xl"></i>
      </div>
      <h2 class="text-xl font-bold text-slate-800">Eliminar Carpeta</h2>
    </div>
  </header>
  <main class="p-4 flex flex-col items-center text-center">
    <div class="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-6">
      <i class="fa-regular fa-trash text-5xl text-error"></i>
    </div>
    <h3 class="text-xl font-bold text-slate-900 mb-6 leading-snug max-w-sm">
      ¿Estás seguro que deseas eliminar La carpeta
      <span class="text-rose-600"> {{ props.carpeta?.nombre }} </span> junto con su contenido?
    </h3>
    <div
      class="warning-box rounded-lg p-4 flex items-start gap-4 text-left w-full mb-8 bg-rose-100/50"
    >
      <div class="mt-1">
        <i class="fa-regular fa-circle-info"></i>
      </div>
      <p class="text-slate-700 text-sm leading-relaxed">
        Esta acción eliminará la carpeta y todos los bancos contenidos en él. Esta acción no se
        puede deshacer.
      </p>
    </div>
  </main>
</template>

<script setup lang="ts">
import { toast } from 'vue-sonner'
import { onMounted, onUnmounted } from 'vue'
import { isAxiosError } from 'axios'
import { useQueryClient } from '@tanstack/vue-query'

import { deleteCarpeta } from '@/api/carpetas/actions/delete-carpeta.action'
import type { Carpeta } from '@/api/carpetas/interfaces'
import { useModalStore } from '@/common/modals/store/modal.store'

const modal = useModalStore()
const queryClient = useQueryClient()

const props = defineProps<{
  carpeta?: Carpeta
}>()

const onSubmit = async () => {
  try {
    if (!props.carpeta) return
    await deleteCarpeta(props.carpeta.idCarpeta)
    toast.success('Se elimino exitosamente la carpeta')

    await queryClient.invalidateQueries({
      queryKey: ['items-unificados'],
    })
    modal.closeModal()
  } catch (error) {
    if (isAxiosError(error)) {
      toast.error(error.response?.data.detail ?? 'Error al eliminar la carpeta')
    }
  }
}

onMounted(() => {
  modal.setSubmitFN(onSubmit)
})

onUnmounted(() => {
  modal.setSubmitFN(null)
})
</script>
