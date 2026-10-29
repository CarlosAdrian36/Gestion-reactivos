<template>
  <div class="space-y-5">
    <header class="flex items-center gap-3">
      <div class="flex size-11 items-center justify-center rounded-full bg-error/10 text-error">
        <i class="fa-solid fa-triangle-exclamation text-xl"></i>
      </div>
      <h2 class="text-lg font-bold">Eliminar integrante</h2>
    </header>

    <p class="text-sm leading-relaxed text-base-content/70">
      ¿Quieres eliminar a
      <span class="font-semibold text-base-content">{{ nombreIntegrante }}</span>
      de este proyecto? Esta acción no se puede deshacer.
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { eliminarMiembroAction } from '@/api/proyectos/actions/eliminar-miembro.action'
import type { Integrante } from '@/api/proyectos/interfaces/proyecto.interface'
import { useModalStore } from '@/common/modals/store/modal.store'

const props = defineProps<{
  idProyecto: string
  integrante: Integrante
}>()

const modal = useModalStore()
const queryClient = useQueryClient()

const nombreIntegrante = computed(
  () =>
    `${props.integrante.nombre} ${props.integrante.apellidoPaterno} ${props.integrante.apellidoMaterno}`.trim(),
)

async function eliminar(): Promise<void> {
  try {
    await eliminarMiembroAction(props.idProyecto, props.integrante.idCuenta)
    await queryClient.invalidateQueries({
      queryKey: ['integrantes-proyecto', props.idProyecto],
    })
    modal.closeModal()
    toast.success('Integrante eliminado del proyecto')
  } catch (error) {
    toast.error(error instanceof Error ? error.message : 'No se pudo eliminar el integrante')
  }
}

onMounted(() => {
  modal.setSubmitFN(eliminar)
})

onUnmounted(() => {
  modal.setSubmitFN(null)
})
</script>
