import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Reactivo } from '@/api/bancos/interfaces/reactivo.interface'
import type { Funcion } from '@/api/proyectos/interfaces/proyecto.interface'

export const useReactivoSeleccionadoStore = defineStore('reactivoSeleccionado', () => {
  const selectedReactivo = ref<Reactivo | null>(null)

  /** Funciones que el usuario actual tiene asignadas en el proyecto en curso. */
  const funcionesAsignadas = ref<Funcion[]>([])

  const hasSelected = computed(() => selectedReactivo.value !== null)

  function select(reactivo: Reactivo) {
    selectedReactivo.value = reactivo
  }

  function setFunciones(funciones: Funcion[]) {
    funcionesAsignadas.value = funciones
  }

  function clear() {
    selectedReactivo.value = null
    funcionesAsignadas.value = []
  }

  return { selectedReactivo, funcionesAsignadas, hasSelected, select, setFunciones, clear }
})
