<template>
  <h3 class="text-lg font-bold">
    {{ props.carpeta ? 'Editar carpeta' : 'Crear carpeta' }}
  </h3>
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
import { saveCarpetaAction } from '@/api/carpetas/actions/create-update-carpeta.action'
import { toast } from 'vue-sonner'
import { isAxiosError } from 'axios'
import { onMounted, onUnmounted } from 'vue'
import type { Carpeta } from '../../../../api/carpetas/interfaces/carpeta.interface'
import { useQueryClient } from '@tanstack/vue-query'
import { useModalStore } from '@/common/modals/store/modal.store'

const props = defineProps<{
  carpeta?: Carpeta
}>()
// await props.afterSave?.()
const modal = useModalStore()
const carpetaSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(3, 'Tiene que tener mas de 3 caracteres')

    .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9._\-\s]+$/, 'Solo se permiten los siguientes caracteres - _ AZ')

    .refine((value) => !value.startsWith('.') && !value.endsWith('.'), {
      message: 'El nombre no puede comenzar ni terminar con un punto.',
    }),
})

// Formulario
const { handleSubmit, errors, defineField, setFieldError, isSubmitting } = useForm({
  validationSchema: toTypedSchema(carpetaSchema),
  initialValues: {
    nombre: props.carpeta?.nombre ?? '',
  },
})
const queryClient = useQueryClient()
// Campo
const [nombre, nombreAttrs] = defineField('nombre')

const onSubmit = handleSubmit(async (values) => {
  try {
    await saveCarpetaAction(values, props.carpeta?.idCarpeta)

    toast.success(
      props.carpeta ? 'Carpeta actualizada correctamente' : 'Carpeta creada correctamente',
    )
    await queryClient.invalidateQueries({
      queryKey: ['items-unificados'],
    })
    await queryClient.invalidateQueries({
      queryKey: ['carpetas'],
    })

    modal.closeModal()
  } catch (error) {
    if (isAxiosError(error)) {
      setFieldError('nombre', error.response?.data.detail ?? 'Error al crear carpeta')
    }
  }
})

onMounted(() => {
  modal.setSubmitFN(onSubmit)
})

onUnmounted(() => {
  modal.setSubmitFN(null)
})
</script>
