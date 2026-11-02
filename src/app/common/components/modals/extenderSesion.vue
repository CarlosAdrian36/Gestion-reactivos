<script setup lang="ts">
import { useAuthStore } from '@/auth/store/auth.store'
import { useModalStore } from '@/common/modals/store/modal.store'
import { onBeforeUnmount, onMounted } from 'vue'
import { toast } from 'vue-sonner'

const authStore = useAuthStore()

const modal = useModalStore()

const onExtenderSesion = async () => {
  try {
    await authStore.extenderSesion()
    modal.closeModal()
  } catch (error) {
    toast.error(error instanceof Error ? error.message : 'No se pudo extender la sesión')
  }
}

onMounted(() => modal.setSubmitFN(onExtenderSesion))
onBeforeUnmount(() => modal.setSubmitFN(null))
</script>
<template>
  <div class="flex flex-col gap-4">
    <p class="text-center text-lg font-semibold">
      Tu sesión está a punto de expirar. ¿Deseas extenderla?
    </p>
    <p class="text-center text-sm text-gray-500">
      Tiempo restante: {{ authStore.getRemainingTime() }}
    </p>
  </div>
</template>
