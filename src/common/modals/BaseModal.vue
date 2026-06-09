<template>
  <dialog class="modal" :open="isOpen">
    <div class="modal-box">
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
          @click="handleButtonClick(btn)"
        >
          {{ btn.label }}
        </button>
      </div>
    </div>
  </dialog>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { onMounted, onBeforeUnmount } from 'vue'
import { useModalStore } from './store/modal.store'
import type { ModalButton } from './interface/modalButton.interface'

const modal = useModalStore()
const { isOpen, component, props, buttons } = storeToRefs(modal)

function handleButtonClick(btn: ModalButton) {
  if (btn.disabled) return

  // Solo dispara submit si el botón lo dice
  if (btn.type === 'submit') {
    modal.submitFN?.()
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
