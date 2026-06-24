<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { toast } from 'vue-sonner'

import { useAuthStore } from '../store/auth.store'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

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
const authStore = useAuthStore()
const [usuario, usaurioatributos] = defineField('usuario')
const [contrasena, contrasenaatributos] = defineField('contrasena')

const onSubmit = handleSubmit(async () => {
  const ok = await authStore.login({
    nombreUsuario: usuario.value,
    password: contrasena.value,
  })
  if (!ok) {
    toast.error('Credenciales Incorrectas')
  }
  console.log('Estado si paso o no:', ok)
  if (ok) return
  toast.error('Ocurrio un error inesperado')
})
</script>

<template>
  <div class="w-full max-w-md sm:max-w-lg lg:max-w-xl">
    <div
      class="glass-card bg-white/70 dark:bg-white/10 border border-white/30 dark:border-white/10 shadow-2xl rounded-3xl p-6 sm:p-8 lg:p-10 transition-all duration-300"
    >
      <!-- HEADER -->
      <div class="flex flex-col items-center gap-6 mb-10">
        <div
          class="flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left"
        >
          <div class="h-12 px-3 flex items-center justify-center rounded-lg">
            <!-- <span class="text-base-content font-bold text-xl tracking-tighter"> UANL </span> -->
            <img
              src="/src/assets/logos/Logo_de_la_UANL.svg.webp"
              alt="UANL Logo"
              class="h-20 w-auto"
            />
          </div>

          <div class="h-8 w-px bg-white/30 dark:bg-white/20"></div>

          <div class="flex items-center gap-2">
            <!-- <span class="text-base-content font-semibold text-2xl tracking-tight"> Nexus </span> -->
            <img src="/src/assets/logos/nx-logo.png" alt="Nexus Logo" class="h-10 w-auto" />
          </div>
        </div>

        <div class="text-center">
          <h1 class="text-2xl font-bold text-base-content/70">Banco de Reactivos</h1>
          <p class="text-sm text-base-content/50">Gestor de bancos para reactivos</p>
        </div>
      </div>

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
              <i :class="showPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'"></i>
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
    </div>

    <div class="mt-8 text-center text-white/60 text-xs">
      <p>© 2026 Universidad Autónoma de Nuevo León</p>
      <div class="flex justify-center gap-4 mt-2">
        <a class="hover:text-white" href="#">Aviso de Privacidad</a>
        <span class="text-white/20">•</span>
        <a class="hover:text-white" href="#">v.0.0.1</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.glass-card {
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
}
</style>
