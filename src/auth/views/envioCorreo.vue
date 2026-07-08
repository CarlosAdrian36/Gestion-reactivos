<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { solicitarCambioContrasena } from '../actions'

const enviado = ref(false)
const errorMensaje = ref('')

const correoSchema = z.object({
  username: z.string().min(1, 'El usuario es requerido'),
  correo: z.string().email('El correo no es válido'),
})
type CorreoForm = z.infer<typeof correoSchema>
const { handleSubmit, errors, meta, isSubmitting, defineField } = useForm<CorreoForm>({
  validationSchema: toTypedSchema(correoSchema),
  initialValues: {
    username: '',
    correo: '',
  },
})

const [username, usernameAttributes] = defineField('username')
const [correo, correoAttributes] = defineField('correo')

const onSubmit = handleSubmit(async (formValues) => {
  errorMensaje.value = ''
  const result = await solicitarCambioContrasena({
    nombreUsuario: formValues.username,
    correoElectronico: formValues.correo,
  })
  if (result.ok) {
    enviado.value = true
  } else {
    errorMensaje.value = result.message ?? 'Error al solicitar el cambio de contraseña'
  }
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
            <img
              src="/src/assets/logos/Logo_de_la_UANL.svg.webp"
              alt="UANL Logo"
              class="h-20 w-auto"
            />
          </div>

          <div class="h-8 w-px bg-white/30 dark:bg-white/20"></div>

          <div class="flex items-center gap-2">
            <img src="/src/assets/logos/nx-logo.png" alt="Nexus Logo" class="h-10 w-auto" />
          </div>
        </div>

        <div class="text-center">
          <h1 class="text-2xl font-bold text-base-content/70">Banco de Reactivos</h1>
          <p class="text-sm text-base-content/50">Gestor de bancos para reactivos</p>
        </div>
      </div>

      <!-- Mensaje de exito -->
      <div v-if="enviado" class="text-center space-y-4">
        <div class="flex justify-center">
          <div class="size-16 rounded-full bg-success/20 flex items-center justify-center">
            <i class="fa-regular fa-envelope text-3xl text-success"></i>
          </div>
        </div>
        <h2 class="text-xl font-bold text-base-content/70">Correo enviado</h2>
        <p class="text-sm text-base-content/50">
          Revisa tu correo electrónico para seguir con los pasos.
        </p>
      </div>

      <!-- FORM -->
      <form v-if="!enviado" @submit.prevent="onSubmit" novalidate class="space-y-6">
        <!-- Usuario -->
        <div>
          <label class="block text-sm font-medium text-base-content/70 mb-2"> Usuario </label>

          <div class="relative group">
            <i
              class="fa-regular fa-user absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors"
            ></i>

            <input
              v-model="username"
              v-bind="usernameAttributes"
              type="text"
              :class="[
                'w-full pl-10 pr-4 py-3 bg-base-200/50 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-base-content placeholder-gray-400 dark:placeholder-gray-500 transition-all outline-none',
                {
                  'border border-red-500 focus:ring-red-500 focus:border-red-500 p-2 ':
                    errors.username,
                },
              ]"
            />
            <span
              v-if="errors.username && meta.touched"
              class="text-red-500 text-sm absolute left-0 -bottom-5"
            >
              {{ errors.username }}
            </span>
          </div>
        </div>
        <!-- Correo -->
        <div>
          <label class="block text-sm font-medium text-base-content/70 mb-2">
            Correo Electrónico
          </label>

          <div class="relative group">
            <i
              class="fa-regular fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors"
            ></i>

            <input
              v-model="correo"
              v-bind="correoAttributes"
              type="email"
              :class="[
                'w-full pl-10 pr-4 py-3 bg-base-200/50 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-base-content placeholder-gray-400 dark:placeholder-gray-500 transition-all outline-none',
                {
                  'border border-red-500 focus:ring-red-500 focus:border-red-500': null,
                },
              ]"
            />
            <span
              v-if="errors.correo && meta.touched"
              class="text-red-500 text-sm absolute left-0 -bottom-5"
            >
              {{ errors.correo }}
            </span>
          </div>
        </div>

        <!-- Error del servidor -->
        <div
          v-if="errorMensaje"
          class="p-3 rounded-xl bg-error/10 border border-error/30 text-error text-sm text-center"
        >
          Las credenciales proporcionadas no son válidas. Por favor, verifica tu usuario y correo
          electrónico e intenta nuevamente.
          <!-- {{ errorMensaje }} -->
        </div>

        <!-- Button -->
        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/30 transition-all active:scale-[0.98]"
        >
          <span v-if="isSubmitting">Enviando correo...</span>
          <span v-else>Enviar </span>
        </button>
      </form>

      <!-- Footer -->
      <div
        class="mt-6 sm:mt-8 text-center border-t border-gray-200 dark:border-white/10 pt-4 sm:pt-6"
      >
        <router-link
          :to="{ name: 'login' }"
          class="text-xs font-semibold text-primary hover:underline"
        >
          Iniciar Sesión
        </router-link>
      </div>
    </div>

    <div class="mt-8 text-center text-white/60 text-xs">
      <p>© 2024 Universidad Autónoma de Nuevo León</p>
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
