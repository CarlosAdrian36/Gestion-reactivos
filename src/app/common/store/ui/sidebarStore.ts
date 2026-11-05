import { defineStore } from 'pinia'
import { useSessionStorage } from '@vueuse/core'

export const useSidebarStore = defineStore('sidebar', () => {
  const isOpen = useSessionStorage('sidebarAbierto', true)
  const reactivosOpen = useSessionStorage('sidebarReactivos', true)

  function toggleSidebar() {
    isOpen.value = !isOpen.value
  }

  function collapseAll() {
    isOpen.value = false
    reactivosOpen.value = false
  }

  function toggleReactivos() {
    reactivosOpen.value = !reactivosOpen.value
  }

  return { isOpen, reactivosOpen, toggleSidebar, collapseAll, toggleReactivos }
})
