import { ref, shallowRef, type Component } from 'vue'
import { defineStore } from 'pinia'
import type { ModalButton } from '../common/interface/Modalbutton.interface'

export const useModalStore = defineStore('modal', () => {
  const isOpen = ref(false)
  const component = shallowRef<Component | null>(null)
  const props = ref<Record<string, unknown>>({})
  const buttons = ref<ModalButton[]>([])

  const submitFN = ref<null | (() => Promise<void> | void)>(null)
  function openModal(
    componentRef: Component,
    componentProps = {},
    modalButton: ModalButton[] = [],
  ) {
    component.value = componentRef
    props.value = componentProps
    isOpen.value = true
    buttons.value = modalButton
  }
  function closeModal() {
    isOpen.value = false
    component.value = null
    props.value = {}
    buttons.value = []
    submitFN.value = null
  }

  function setSubmitFN(fn: (() => void) | null) {
    submitFN.value = fn
  }

  return { isOpen, component, props, buttons, submitFN, openModal, closeModal, setSubmitFN }
})
