<template>
  <h3 class="text-lg font-bold">Crear proyecto</h3>

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
          Nombre del Proyecto
        </span>
      </label>
      <p v-if="errors.nombre" class="text-error text-sm mt-1">
        {{ errors.nombre }}
      </p>
    </div>
  </div>

  <div class="pb-4">
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
          Descripción del Proyecto
        </span>
      </label>
      <p v-if="errors.descripcion" class="text-error text-sm mt-1">
        {{ errors.descripcion }}
      </p>
    </div>
  </div>

  <div class="pb-4">
    <p class="text-sm font-semibold text-neutral-600 mb-2">Idiomas del proyecto</p>
    <div class="grid grid-cols-2 gap-3">
      <label
        v-for="opcion in opcionesIdiomas"
        :key="opcion.idiomaId"
        class="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition"
        :class="
          esSeleccionado(opcion.idiomaId)
            ? 'border-info bg-info/10'
            : 'border-base-300 bg-base-200/50'
        "
      >
        <input
          v-model="seleccionados"
          type="checkbox"
          class="hidden"
          :value="opcion.idiomaId"
        />
        <img :src="opcion.bandera" :alt="opcion.descripcion" class="w-8 h-6 object-contain" />
        <span class="flex-1 text-sm font-semibold">{{ opcion.descripcion }}</span>
        <span
          class="size-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
          :class="
            esSeleccionado(opcion.idiomaId)
              ? 'bg-info text-info-content'
              : 'bg-base-300 text-base-content/40'
          "
        >
          {{ esSeleccionado(opcion.idiomaId) ? '✓' : '' }}
        </span>
      </label>
    </div>
  </div>
  <div class="divider"></div>
</template>

<script lang="ts" setup>
import z from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { useQueryClient } from '@tanstack/vue-query'
import { useForm } from 'vee-validate'
import { onMounted, onUnmounted, ref } from 'vue'
import { toast } from 'vue-sonner'
import { isAxiosError } from 'axios'

import {
  createProyectoAction,
  type CreateProyectoRequest,
} from '@/api/proyectos/actions/create-proyecto.action'
import { useModalStore } from '@/common/modals/store/modal.store'

import banderaUs from '@/assets/banderas/us.png'
import banderaFr from '@/assets/banderas/fr.png'

const modal = useModalStore()
const queryClient = useQueryClient()

interface OpcionIdioma {
  idiomaId: number
  etiqueta: string
  descripcion: string
  bandera: string
}

const opcionesIdiomas: OpcionIdioma[] = [
  { idiomaId: 2, etiqueta: 'en_US', descripcion: 'Ingles', bandera: banderaUs },
  { idiomaId: 3, etiqueta: 'fr_FR', descripcion: 'Frances', bandera: banderaFr },
]

const seleccionados = ref<number[]>([])

function esSeleccionado(idiomaId: number): boolean {
  return seleccionados.value.includes(idiomaId)
}

const proyectoSchema = z.object({
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
  validationSchema: toTypedSchema(proyectoSchema),
  initialValues: {
    nombre: '',
    descripcion: '',
  },
})

const [nombre, nombreAttrs] = defineField('nombre')
const [descripcion, descripcionAttrs] = defineField('descripcion')

const onSubmit = handleSubmit(async (values) => {
  const idiomasSeleccionados = opcionesIdiomas
    .filter((opcion) => esSeleccionado(opcion.idiomaId))
    .map((opcion) => opcion.etiqueta)

  const proyecto: CreateProyectoRequest = {
    nombre: values.nombre,
    descripcion: values.descripcion,
    ...(idiomasSeleccionados.length > 0 && { idiomas: idiomasSeleccionados }),
  }

  try {
    await createProyectoAction(proyecto)
    toast.success('Proyecto creado correctamente')
    await queryClient.invalidateQueries({ queryKey: ['proyectos'] })
    modal.closeModal()
  } catch (error) {
    toast.error('Algo ocurrio y no se pudo completar la operacion')
    if (isAxiosError(error)) {
      setFieldError('nombre', 'Ya existe un proyecto con ese nombre')
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
