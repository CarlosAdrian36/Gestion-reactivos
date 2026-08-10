<template>
  <dialog class="modal" :open="isOpen">
    <div class="modal-box" :class="modalClass">
      <!-- Contenido dinámico -->
      <component :is="component" v-bind="props" v-if="component" />

      <div v-if="buttons.length" class="modal-action flex justify-end gap-2">
        <!-- Botones dinámicos -->
        <button
          v-for="(btn, i) in buttons"
          :key="i"
          class="btn"
          :class="{
            'btn-primary ': btn.variant === 'primary',
            'btn-error': btn.variant === 'error',
            'btn-outline': btn.variant === 'outline' || !btn.variant,
          }"
          :disabled="isSubmitting || btn.disabled"
          @click="handleButtonClick(btn)"
        >
          <span v-if="isSubmitting && btn.type === 'submit'" class="loading loading-spinner loading-sm"></span>
          {{ isSubmitting && btn.type === 'submit' ? btn.loadingLabel ?? btn.label : btn.label }}
        </button>
      </div>
    </div>
  </dialog>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useModalStore } from './store/modal.store'
import type { ModalButton } from './interface/modalButton.interface'

const modal = useModalStore()
const { isOpen, component, props, buttons, submitFN, modalClass } = storeToRefs(modal)

const isSubmitting = ref(false)

async function handleButtonClick(btn: ModalButton) {
  if (btn.disabled || isSubmitting.value) return

  // Solo dispara submit si el botón lo dice
  if (btn.type === 'submit') {
    isSubmitting.value = true
    try {
      await submitFN.value?.()
    } finally {
      isSubmitting.value = false
    }
    return
  }

  // Botón normal
  if (btn.action) btn.action()
  else modal.closeModal()
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && isOpen.value) {
    modal.closeModal()
  }
}
onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>
