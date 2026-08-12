import { ref, computed } from 'vue'
import type { Reactivo } from '@/api/bancos/interfaces/reactivo.interface'

const selectedReactivo = ref<Reactivo | null>(null)
const reactivos = ref<Reactivo[]>([])

export function useReactivosStore() {
  const hasSelected = computed(() => selectedReactivo.value !== null)

  function select(reactivo: Reactivo) {
    selectedReactivo.value = reactivo
  }

  function clear() {
    selectedReactivo.value = null
  }

  function setReactivos(list: Reactivo[]) {
    reactivos.value = list
  }

  return {
    selectedReactivo,
    reactivos,
    hasSelected,
    select,
    clear,
    setReactivos,
  }
}
