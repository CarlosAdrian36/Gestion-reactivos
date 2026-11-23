<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { toast } from 'vue-sonner'

import { useAuthStore } from '../store/auth.store'
import { useModalStore } from '@/common/modals/store/modal.store'
import TumbarSesion from '@/app/common/components/modals/tumbarSesion.vue'
import AuthCard from '@/auth/components/AuthCard.vue'

const authStore = useAuthStore()
const modal = useModalStore()
const loginSchema = z.object({
  usuario: z.string().min(1, 'El usuario es requerido'),
  contrasena: z.string().min(1, 'La contraseña es requerida'),
})

const showPassword = ref(false)

const togglePassword = () => {
  showPassword.value = !showPassword.value
}
type LoginForm = z.infer<typeof loginSchema>

const { handleSubmit, errors, meta, defineField, isSubmitting } = useForm<LoginForm>({
  validationSchema: toTypedSchema(loginSchema),
  initialValues: {
    usuario: '',
    contrasena: '',
  },
})
const [usuario, usaurioatributos] = defineField('usuario')
const [contrasena, contrasenaatributos] = defineField('contrasena')

// const onSubmit = handleSubmit(async () => {
//   if (authStore.hasActiveSession()) {
//     const tiempo = authStore.getRemainingTime()
//     toast.warning(
//       `${tiempo} minutos restantes de sesión activa. Cierre sesión antes de iniciar una nueva.`,
//     )
//     return
//   }

//   const result = await authStore.login({
//     nombreUsuario: usuario.value,
//     password: contrasena.value,
//   })
//   if (result.ok) return
//   toast.error(result.message || 'Ocurrió un error al iniciar sesión. Intente nuevamente.')
// })

const onSubmit = handleSubmit(async () => {
  console.log('Iniciando sesión con:', usuario.value, contrasena.value)
  const result = await authStore.login({
    nombreUsuario: usuario.value,
    password: contrasena.value,
  })
  console.log('Resultado del inicio de sesión:', result.message)
  if (!result.ok) {
    if (result.message === 'Ya existe una sesión activa para este usuario.') {
      modal.openModal(
        TumbarSesion,
        {
          usuario: usuario.value,
          contrasena: contrasena.value,
        },
        [
          { label: 'Cerrar', variant: 'outline' },
          { label: 'Aceptar', variant: 'primary', type: 'submit' },
        ],
        'max-w-2xl',
      )
    } else {
      toast.error(result.message || 'Ocurrió un error al iniciar sesión. Intente nuevamente.')
    }
  }
  if (result.ok) {
  }
})
</script>

<template>
  <AuthCard version="v.0.22.1">
    <!-- FORM -->
    <form @submit="onSubmit" class="space-y-6">
      <!-- Usuario -->
      <div>
        <label class="block text-sm font-medium text-base-content/80 mb-2"> Usuario </label>

        <div class="relative group">
          <i
            class="fa-regular fa-user absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors"
          ></i>

          <input
            v-model="usuario"
            v-bind="usaurioatributos"
            type="text"
            :class="[
              'w-full pl-10 pr-4 py-3 bg-base-200/50 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-base-content placeholder-gray-400 dark:placeholder-gray-500 transition-all outline-none',
              {
                'border border-red-500 focus:ring-red-500 focus:border-red-500': errors.usuario,
              },
            ]"
          />
          <span class="text-red-500 text-sm absolute left-0 -bottom-5">
            {{ errors.usuario }}
          </span>
        </div>
      </div>

      <!-- Password -->
      <div>
        <div class="flex justify-between items-center mb-2">
          <label class="block text-sm font-medium text-base-content/80"> Contraseña </label>
          <router-link
            :to="{ name: 'EnviodeCorreo' }"
            class="text-xs font-semibold text-primary hover:underline"
            tabindex="1"
          >
            ¿Olvidaste tu contraseña?
          </router-link>
        </div>

        <div class="relative group">
          <i
            class="fas fa-key absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors"
          ></i>

          <input
            v-model="contrasena"
            v-bind="contrasenaatributos"
            :type="showPassword ? 'text' : 'password'"
            :class="[
              'w-full pl-10 pr-4 py-3 bg-base-200/50 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-base-content placeholder-gray-400 dark:placeholder-gray-500 transition-all outline-none',
              {
                'border border-red-500 focus:ring-red-500 focus:border-red-500':
                  errors.contrasena,
              },
            ]"
          />
          <span
            v-if="errors.contrasena && meta.touched"
            class="text-red-500 text-sm absolute left-0 -bottom-5"
          >
            {{ errors.contrasena }}
          </span>
          <!-- Toggle Password -->
          <button
            type="button"
            @click="togglePassword"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
          >
            <i
              tabindex="1"
              :class="showPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'"
            ></i>
          </button>
        </div>
      </div>

      <button
        type="submit"
        class="w-full py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/30 transition-all active:scale-[0.98]"
      >
        <span v-if="isSubmitting">Iniciando sesión...</span>
        <span v-else>Iniciar Sesión</span>
      </button>
    </form>

    <!-- Footer -->
    <template #footer>
      <div
        class="mt-6 sm:mt-8 pt-4 sm:pt-6 text-center border-t border-gray-200 dark:border-white/10"
      >
        <p class="text-sm">
          ¿No tienes una cuenta?
          <a class="font-semibold text-primary hover:underline" href="#">
            Contacta a tu administrador
          </a>
        </p>
      </div>
    </template>
  </AuthCard>
</template>
