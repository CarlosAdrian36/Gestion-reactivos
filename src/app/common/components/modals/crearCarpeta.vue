<template>
  <h3 class="text-lg font-bold">Crear carpeta</h3>
  <!-- <from method="dialog">
    <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
  </from> -->

  <div class="py-4">
    <div class="w-full">
      <label class="relative block">
        <input
          v-model="nombre"
          v-bind="nombreAttrs"
          type="text"
          placeholder=" "
          class="peer w-full h-12 px-3 leading-5 bg-base-100 border border-neutral-400 rounded-md shadow-sm transition focus:shadow-none focus:border-primary focus:ring-1 focus:ring-primary/40 focus:outline-none"
        />

        <span
          class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600 bg-base-100 px-1 leading-none transition-all pointer-events-none peer-focus:top-0 peer-focus:text-xs peer-focus:text-primary peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:text-xs"
        >
          Nombre de la carpeta
        </span>
      </label>
      <p v-if="errors.nombre" class="text-error text-sm mt-1">
        {{ errors.nombre }}
      </p>
      <!-- <p v-if="errors.nombre" class="text-error text-sm">{{ errors.nombre }}</p> -->
    </div>
  </div>
</template>
<script setup lang="ts">
import z from 'zod'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { createCarpetaAction } from '@/api/carpetas/actions/create-update-carpeta.action'

const carpetaSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, 'El nombre es requerido')

    .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9._\-\s]+$/, 'Solo se permiten los siguientes caracteres - _ AZ')

    .refine((value) => !value.startsWith('.') && !value.endsWith('.'), {
      message: 'El nombre no puede comenzar ni terminar con un punto.',
    }),
})

// Formulario
const { handleSubmit, errors, defineField, setFieldError } = useForm({
  validationSchema: toTypedSchema(carpetaSchema),
})

// Campo
const [nombre, nombreAttrs] = defineField('nombre')

const onSubmit = handleSubmit(async (values) => {
  try {
    await createCarpetaAction(values)
  } catch (error) {}
})
</script>
