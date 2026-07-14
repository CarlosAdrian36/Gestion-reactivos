<template>
  <h3 class="text-lg font-bold">
    {{ props.banco ? 'Editar banco' : 'Crear banco' }}
  </h3>

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
          Nombre del Banco
        </span>
      </label>
      <p v-if="errors.nombre" class="text-error text-sm mt-1">
        {{ errors.nombre }}
      </p>
    </div>
  </div>

  <div class="py-4">
    <div class="w-full">
      <label class="relative block">
        <textarea
          v-model="descripcion"
          v-bind="descripcionAttrs"
          rows="4"
          placeholder=" "
          class="peer w-full px-3 pt-7 pb-2 text-[15px] leading-5 bg-transparent border border-neutral-700 rounded-md resize-none transition focus:border-primary focus:ring-1 focus:ring-primary/40 focus:outline-none"
        ></textarea>

        <span
          class="absolute left-3 top-2 text-neutral-600 bg-base-100 px-1 leading-none transition-all pointer-events-none peer-focus:top-1 peer-focus:text-xs peer-focus:text-primary peer-not-placeholder-shown:top-1 peer-not-placeholder-shown:text-xs"
        >
          Descripción del Banco
        </span>
      </label>
      <p v-if="errors.descripcion" class="text-error text-sm mt-1">
        {{ errors.descripcion }}
      </p>
    </div>
  </div>
  <div class="divider"></div>
</template>
<script lang="ts" setup>
import z from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { useQueryClient } from '@tanstack/vue-query'
import { useForm } from 'vee-validate'
import { onMounted, onUnmounted } from 'vue'
import { toast } from 'vue-sonner'

import { saveBancoAction } from '@/api/bancos/actions/create-upadte-banco.action'

import type { Banco } from '@/api/bancos/interfaces/banco.interface'
import { useModalStore } from '@/common/modals/store/modal.store'
import { isAxiosError } from 'axios'

const props = defineProps<{
  banco?: Banco
  carpetaId?: string
}>()

const modal = useModalStore()

const bancoSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(3, 'Tienen que tener por lo menos 3 caracteres')
    .max(100, 'Máximo 100 caracteres')
    .regex(
      /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9._\-\s]+$/,
      'Solo se permiten los siguientes caracteres  . - _ A-Z a-z 0-9',
    )

    .refine((value) => !value.startsWith('.') && !value.endsWith('.'), {
      message: 'El nombre no puede comenzar ni terminar con un punto.',
    }),
  descripcion: z.string().trim().optional(),
})

const { handleSubmit, errors, defineField, setFieldError } = useForm({
  validationSchema: toTypedSchema(bancoSchema),
  initialValues: {
    nombre: props.banco?.nombre ?? '',
    descripcion: props.banco?.descripcion ?? '',
  },
})
const queryClient = useQueryClient()
const [nombre, nombreAttrs] = defineField('nombre')
const [descripcion, descripcionAttrs] = defineField('descripcion')

const onSubmit = handleSubmit(async (values) => {
  console.warn(props.carpetaId)
  try {
    await saveBancoAction({ ...values, idCarpeta: props.carpetaId }, props.banco?.idBanco)

    toast.success(props.banco ? 'Banco Actualizado correctamente' : 'Banco creado correctamente')
    if (props.carpetaId) {
      await queryClient.invalidateQueries({
        queryKey: ['bancos-carpeta', props.carpetaId],
      })
    }
    await queryClient.invalidateQueries({
      queryKey: ['items-unificados'],
    })
    modal.closeModal()
  } catch (error) {
    toast.error('Algo ocurrio y no se pudo completar la operacion')
    if (isAxiosError(error)) {
      setFieldError('nombre', 'Ya existe un banco con ese nombre')
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
