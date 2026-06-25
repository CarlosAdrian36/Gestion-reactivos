<template>
  <div class="flex flex-col items-center text-center p-4">
    <div
      class="w-20 h-20 rounded-full flex items-center justify-center mb-6"
      style="background: rgba(251, 191, 36, 0.15)"
    >
      <i class="fa-solid fa-triangle-exclamation text-4xl" style="color: #f59e0b"></i>
    </div>

    <h3 class="text-xl font-bold text-base-content mb-3">Sesión activa detectada</h3>

    <p class="text-base-content/70 max-w-sm mb-8 leading-relaxed">
      Ya hay una sesión activa para este usuario. ¿Deseas cerrarla e iniciar una nueva?
    </p>

    <div class="flex gap-3 w-full">
      <button
        class="btn btn-outline flex-1"
        @click="onCancel"
      >
        Cancelar
      </button>
      <button
        class="btn btn-primary flex-1"
        @click="onConfirm"
      >
        Cerrar e iniciar sesión
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  onConfirm: () => void
  onCancel: () => void
}>()
</script>
