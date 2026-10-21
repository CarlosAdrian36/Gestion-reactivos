<template>
  <h3 class="text-lg font-bold">Sesión Activa</h3>
  <p class="py-4">Actualmente ya existe una sesión activa. ¿Deseas continuar e iniciar sesión?</p>
</template>

<script lang="ts" setup>
import { useAuthStore } from '@/auth/store/auth.store'
import { useModalStore } from '@/common/modals/store/modal.store'
import { onBeforeUnmount, onMounted } from 'vue'
import { toast } from 'vue-sonner'

const authStore = useAuthStore()
const modal = useModalStore()
const props = defineProps<{
  usuario: string
  contrasena: string
}>()

const onSubmit = async () => {
  try {
    const result = await authStore.login(
      {
        nombreUsuario: props.usuario,
        password: props.contrasena,
      },
      true,
    )
    if (!result.ok) {
      toast.error(result.message || 'No se pudo iniciar sesión.')
      return
    }

    modal.closeModal()
    toast.success('Inicio de sesión exitoso')
  } catch (error) {
    console.error('Error al iniciar sesión:', error)
  }
}

onMounted(() => modal.setSubmitFN(onSubmit))
onBeforeUnmount(() => modal.setSubmitFN(null))
</script>
