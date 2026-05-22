export interface ModalButton {
  label: string
  variant?: 'primary' | 'error' | 'outline'
  type?: 'button' | 'submit'
  action?: () => void
  disabled?: boolean
}
