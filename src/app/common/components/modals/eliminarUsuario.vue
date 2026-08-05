<template>
  <header class="flex items-center justify-between p-6 border-b border-gray-100">
    <div class="flex items-center gap-3">
      <div class="text-rose-500">
        <i class="fa-solid fa-triangle-exclamation text-3xl"></i>
      </div>
      <h2 class="text-xl font-bold text-slate-800">Eliminar Usuario</h2>
    </div>
  </header>
  <main class="p-4 flex flex-col items-center text-center">
    <div class="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-6">
      <i class="fa-regular fa-trash text-5xl text-error"></i>
    </div>
    <h3 class="text-xl font-bold text-slate-900 mb-6 leading-snug max-w-sm">
      ¿Estás seguro que deseas eliminar al usuario
      <span class="text-rose-600"> {{ props.usuario?.nombreUsuario }} </span>?
    </h3>
    <div
      class="warning-box rounded-lg p-4 flex items-start gap-4 text-left w-full mb-8 bg-rose-100/50"
    >
      <div class="mt-1">
        <i class="fa-regular fa-circle-info"></i>
      </div>
      <p class="text-slate-700 text-sm leading-relaxed">
        Esta acción eliminará el usuario y todos sus datos asociados. Esta acción no se puede
        deshacer.
      </p>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { deleteUser } from '@/api/usuarios/actions/delete-user.action'
import type { Cuenta } from '@/api/usuarios/interfaces/ususarios.interface'
import { useModalStore } from '@/common/modals/store/modal.store'
import { useQueryClient } from '@tanstack/vue-query'
import { isAxiosError } from 'axios'
import { onMounted, onUnmounted } from 'vue'
import { toast } from 'vue-sonner'

const modal = useModalStore()
const queryClient = useQueryClient()

const props = defineProps<{
  usuario: Cuenta
}>()

const onSubmit = async () => {
  try {
    await deleteUser(props.usuario.idCuenta)
    toast.success('Usuario eliminado correctamente')
    console.log('hasta aqui va todo bien')
    modal.closeModal()
    await queryClient.invalidateQueries({
      queryKey: ['usuarios'],
    })
  } catch (error) {
    if (isAxiosError(error)) {
      toast.error(error.response?.data?.detail ?? 'Error al eliminar el usuario')
    }
  }
  console.log('Aqui se tiene que eliminar el usuario')
}

onMounted(() => {
  modal.setSubmitFN(onSubmit)
})

onUnmounted(() => {
  modal.setSubmitFN(null)
})
</script>
