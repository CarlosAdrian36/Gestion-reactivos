<script setup lang="ts">
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { establecerContrasena } from '../actions/establecercontrasena.action'
import { toast } from 'vue-sonner'
import { isAxiosError } from 'axios'
import AuthCard from '@/auth/components/AuthCard.vue'

const isSubmitting = ref(false)
const showPassword = ref(false)
const router = useRouter()
const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const resetearSchema = z
  .object({
    contrasena: z
      .string()
      .min(9, 'La contraseña debe tener al menos 9 caracteres')
      .max(16, 'La contraseña no debe exceder los 16 caracteres')
      .regex(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula')
      .regex(/[a-z]/, 'La contraseña debe contener al menos una letra minúscula')
      .regex(/[0-9]/, 'La contraseña debe contener al menos un número')
      .regex(/[^A-Za-z0-9]/, 'La contraseña debe contener al menos un carácter especial')
      .refine((val) => !/\s/.test(val), 'La contraseña no debe contener espacios'),
    confirmacion: z.string(),
  })
  .refine((data) => data.contrasena === data.confirmacion, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmacion'],
  })

type ReseteoForm = z.infer<typeof resetearSchema>

const { handleSubmit, errors, values, defineField, submitCount } = useForm<ReseteoForm>({
  validationSchema: toTypedSchema(resetearSchema),
  initialValues: {
    contrasena: '',
    confirmacion: '',
  },
})
const onSubmit = handleSubmit(async (values) => {
  console.log('Formulario válido:', values)
  try {
    await establecerContrasena(
      {
        password: values.confirmacion,
      },
      solicitud,
    )
    toast.success('Contraseña establecida correctamente. Redirigiendo al inicio de sesión...')
    setTimeout(() => {
      router.replace('/auth/login')
    }, 1500)
  } catch (error) {
    const detail = isAxiosError(error) ? error.response?.data?.detail : undefined
    toast.error(detail ?? 'Ocurrió un error al establecer la contraseña')
  } finally {
    isSubmitting.value = false
  }
})

const [contrasena, contrasenaAttrs] = defineField('contrasena')
const [confirmacion, confirmacionAttrs] = defineField('confirmacion')

const route = useRoute()
const solicitud = route.query.SolicitudId as string
console.log(solicitud)
console.log(route.query)
console.log(route.query.Solicitud)
console.log(route.query.SolicitudId)
</script>

<template>
  <AuthCard title="Establecer contraseña" subtitle="" card-opacity="30" :show-copyright="false">
    <div
      v-if="submitCount > 0 && Object.keys(errors).length"
      role="alert"
      class="alert alert-error"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 shrink-0 stroke-current"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <!-- <span>Verifica los requisitos</span> -->
      <span>
        {{
          errors.contrasena
            ? 'Verifica los requisitos de la contraseña'
            : errors.confirmacion
              ? 'Las contraseñas no coinciden'
              : 'Revisa los campos'
        }}
      </span>
    </div>

    <!-- FORM -->
    <form @submit.prevent="onSubmit" class="space-y-6 pt-3">
      <!-- Nueva Contraseña -->
      <div>
        <label class="block text-sm font-medium text-base-content/70 mb-2">
          Nueva Contraseña
        </label>

        <div class="relative group">
          <i
            class="fas fa-key absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors"
          ></i>

          <input
            v-model="contrasena"
            v-bind="contrasenaAttrs"
            :type="showPassword ? 'text' : 'password'"
            :class="[
              'w-full pl-10 pr-4 py-3 bg-base-200/50 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-base-content placeholder-gray-400 dark:placeholder-gray-500 transition-all outline-none',
              {
                'border border-red-500 focus:ring-red-500 focus:border-red-500':
                  errors.contrasena,
              },
            ]"
          />
          <button
            type="button"
            @click="togglePassword"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
          >
            <i :class="showPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'"></i>
          </button>
        </div>
        <div class="mt-3 space-y-1">
          <div class="flex items-center gap-2">
            <div
              :class="
                values.contrasena &&
                values.contrasena.length >= 9 &&
                values.contrasena.length <= 16
                  ? 'text-success'
                  : 'text-gray-700'
              "
            >
              <i class="fa-solid fa-circle-check text-md"></i>
            </div>
            <span class="leading-none text-sm">Entre 9 y 16 caracteres</span>
          </div>

          <div class="flex items-center gap-2">
            <div :class="/[A-Z]/.test(values.contrasena) ? 'text-success' : 'text-gray-700'">
              <i class="fa-solid fa-circle-check text-md"></i>
            </div>
            <span class="leading-none text-sm">Al menos una letra mayúscula</span>
          </div>

          <div class="flex items-center gap-2">
            <div :class="/[a-z]/.test(values.contrasena) ? 'text-success' : 'text-gray-700'">
              <i class="fa-solid fa-circle-check text-md"></i>
            </div>
            <span class="leading-none text-sm">Al menos una letra minúscula</span>
          </div>

          <div class="flex items-center gap-2">
            <div
              :class="/[^A-Za-z0-9]/.test(values.contrasena) ? 'text-success' : 'text-gray-700'"
            >
              <i class="fa-solid fa-circle-check text-md"></i>
            </div>
            <span class="leading-none text-sm">Al menos un carácter especial</span>
          </div>

          <div class="flex items-center gap-2">
            <div :class="/[0-9]/.test(values.contrasena) ? 'text-success' : 'text-gray-700'">
              <i class="fa-solid fa-circle-check text-md"></i>
            </div>
            <span class="leading-none text-sm">Al menos un número</span>
          </div>

          <div class="flex items-center gap-2">
            <div
              :class="
                values.contrasena && !/\s/.test(values.contrasena)
                  ? 'text-success'
                  : 'text-gray-700'
              "
            >
              <i class="fa-solid fa-circle-check text-md"></i>
            </div>
            <span class="leading-none text-sm">Sin espacios </span>
          </div>
        </div>
      </div>
      <!-- Confirmar Contraseña -->
      <div>
        <label class="block text-sm font-medium text-base-content/70 mb-2">
          Confirmar Contraseña
        </label>

        <div class="relative group">
          <i
            class="fas fa-key absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors"
          ></i>

          <input
            v-model="confirmacion"
            v-bind="confirmacionAttrs"
            :type="showPassword ? 'text' : 'password'"
            :class="[
              'w-full pl-10 pr-4 py-3 bg-base-200/50 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-base-content placeholder-gray-400 dark:placeholder-gray-500 transition-all outline-none',
              {
                'border border-red-500 focus:ring-red-500 focus:border-red-500':
                  errors.confirmacion,
              },
            ]"
          />
          <button
            type="button"
            @click="togglePassword"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
          >
            <i :class="showPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'"></i>
          </button>
        </div>
      </div>

      <!-- Button -->
      <button
        type="submit"
        :disabled="isSubmitting"
        class="w-full py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/30 transition-all active:scale-[0.98]"
      >
        <span v-if="isSubmitting">
          <span class="loading loading-spinner"></span>
        </span>
        <span v-if="!isSubmitting"> Establecer </span>
        <span v-else> Estableciendo contraseña </span>
      </button>
    </form>
  </AuthCard>
</template>
