<template>
  <h3 class="text-lg font-bold">Cambiar contraseña</h3>

  <div class="py-4">
    <div class="w-full">
      <label class="relative block">
        <input
          v-model="password"
          v-bind="passwordAttrs"
          :type="mostrarPassword ? 'text' : 'password'"
          placeholder=" "
          class="peer w-full h-12 px-3 leading-5 bg-base-100 border border-neutral-400 rounded-md shadow-sm transition focus:shadow-none focus:border-primary focus:ring-1 focus:ring-primary/40 focus:outline-none pr-10"
        />
        <span
          class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600 bg-base-100 px-1 leading-none transition-all pointer-events-none peer-focus:top-0 peer-focus:text-xs peer-focus:text-primary peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:text-xs"
        >
          Contraseña actual
        </span>
        <button
          type="button"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
          @click="mostrarPassword = !mostrarPassword"
        >
          <i :class="mostrarPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'"></i>
        </button>
      </label>
      <p v-if="errors.password" class="text-error text-sm mt-1">
        {{ errors.password }}
      </p>
    </div>
  </div>

  <div class="py-4">
    <div class="w-full">
      <label class="relative block">
        <input
          v-model="passwordNuevo"
          v-bind="passwordNuevoAttrs"
          :type="mostrarNuevo ? 'text' : 'password'"
          placeholder=" "
          class="peer w-full h-12 px-3 leading-5 bg-base-100 border border-neutral-400 rounded-md shadow-sm transition focus:shadow-none focus:border-primary focus:ring-1 focus:ring-primary/40 focus:outline-none pr-10"
        />
        <span
          class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600 bg-base-100 px-1 leading-none transition-all pointer-events-none peer-focus:top-0 peer-focus:text-xs peer-focus:text-primary peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:text-xs"
        >
          Nueva contraseña
        </span>
        <button
          type="button"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
          @click="mostrarNuevo = !mostrarNuevo"
        >
          <i :class="mostrarNuevo ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'"></i>
        </button>
      </label>
      <p v-if="errors.passwordNuevo" class="text-error text-sm mt-1">
        {{ errors.passwordNuevo }}
      </p>

      <div class="mt-3 space-y-1">
        <div class="flex items-center gap-2">
          <div
            :class="
              values.passwordNuevo &&
              values.passwordNuevo.length >= 9 &&
              values.passwordNuevo.length <= 16
                ? 'text-success'
                : 'text-gray-700'
            "
          >
            <i class="fa-solid fa-circle-check text-md"></i>
          </div>
          <span class="leading-none text-sm">Entre 9 y 16 caracteres</span>
        </div>

        <div class="flex items-center gap-2">
          <div :class="/[A-Z]/.test(values.passwordNuevo) ? 'text-success' : 'text-gray-700'">
            <i class="fa-solid fa-circle-check text-md"></i>
          </div>
          <span class="leading-none text-sm">Al menos una letra mayúscula</span>
        </div>

        <div class="flex items-center gap-2">
          <div :class="/[a-z]/.test(values.passwordNuevo) ? 'text-success' : 'text-gray-700'">
            <i class="fa-solid fa-circle-check text-md"></i>
          </div>
          <span class="leading-none text-sm">Al menos una letra minúscula</span>
        </div>

        <div class="flex items-center gap-2">
          <div
            :class="/[^A-Za-z0-9]/.test(values.passwordNuevo) ? 'text-success' : 'text-gray-700'"
          >
            <i class="fa-solid fa-circle-check text-md"></i>
          </div>
          <span class="leading-none text-sm">Al menos un carácter especial</span>
        </div>

        <div class="flex items-center gap-2">
          <div :class="/[0-9]/.test(values.passwordNuevo) ? 'text-success' : 'text-gray-700'">
            <i class="fa-solid fa-circle-check text-md"></i>
          </div>
          <span class="leading-none text-sm">Al menos un número</span>
        </div>

        <div class="flex items-center gap-2">
          <div
            :class="
              values.passwordNuevo && !/\\s/.test(values.passwordNuevo)
                ? 'text-success'
                : 'text-gray-700'
            "
          >
            <i class="fa-solid fa-circle-check text-md"></i>
          </div>
          <span class="leading-none text-sm">Sin espacios</span>
        </div>
      </div>
    </div>
  </div>

  <div class="divider"></div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { toast } from 'vue-sonner'
import { useModalStore } from '@/common/modals/store/modal.store'
import { actualizarContrasena } from '@/auth/actions'

const modal = useModalStore()
const mostrarPassword = ref(false)
const mostrarNuevo = ref(false)

const schema = z
  .object({
    password: z.string().min(1, 'La contraseña actual es requerida'),
    passwordNuevo: z
      .string()
      .min(9, 'La contraseña debe tener al menos 9 caracteres')
      .max(16, 'La contraseña no debe exceder los 16 caracteres')
      .regex(/[A-Z]/, 'Debe contener al menos una letra mayúscula')
      .regex(/[a-z]/, 'Debe contener al menos una letra minúscula')
      .regex(/[0-9]/, 'Debe contener al menos un número')
      .regex(/[^A-Za-z0-9]/, 'Debe contener al menos un carácter especial')
      .refine((val) => !/\s/.test(val), 'No debe contener espacios'),
  })

type Form = z.infer<typeof schema>

const { handleSubmit, errors, values, defineField, setFieldError } = useForm<Form>({
  validationSchema: toTypedSchema(schema),
  initialValues: {
    password: '',
    passwordNuevo: '',
  },
})

const [password, passwordAttrs] = defineField('password')
const [passwordNuevo, passwordNuevoAttrs] = defineField('passwordNuevo')

const onSubmit = handleSubmit(async (values) => {
  const result = await actualizarContrasena({
    password: values.password,
    passwordNuevo: values.passwordNuevo,
  })
  if (result.ok) {
    toast.success('Contraseña actualizada correctamente')
    modal.closeModal()
  } else {
    setFieldError('password', result.message ?? 'Error al actualizar la contraseña')
  }
})

onMounted(() => {
  modal.setSubmitFN(onSubmit)
})

onUnmounted(() => {
  modal.setSubmitFN(null)
})
</script>
