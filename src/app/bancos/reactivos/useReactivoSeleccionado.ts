import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Reactivo } from '@/api/bancos/interfaces/reactivo.interface'

export const useReactivoSeleccionadoStore = defineStore('reactivoSeleccionado', () => {
  const selectedReactivo = ref<Reactivo | null>(null)

  const hasSelected = computed(() => selectedReactivo.value !== null)

  function select(reactivo: Reactivo) {
    selectedReactivo.value = reactivo
  }

  function clear() {
    selectedReactivo.value = null
  }

  return { selectedReactivo, hasSelected, select, clear }
})
