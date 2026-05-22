<script setup lang="ts">
import z from 'zod'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { onBeforeUnmount, onMounted, watch } from 'vue'
import { useModalStore } from '../store/modal.store'

// const store = useItemsStore();
const modal = useModalStore()

const props = defineProps<{
  modo?: 'editar' | 'crear'
  carpeta?: {
    id: number
    nombre: string
    fecha: string
    bancos: number
  }
}>()

const crearCarpetaSchema = z.object({
  nombre: z
    .string()
    .min(1, 'El nombre de la carpeta es requerido')
    .min(3, 'Minimo 3 caracteres')
    .max(100, 'El nombre de la carpeta no puede exceder los 100 caracteres')
    .refine((value) => {
      return !store.carpetas.some((c) => {
        if (props.modo === 'editar' && c.id === props.carpeta?.id) {
          return false // Ignorar la carpeta actual al editar
        }
        return c.nombre.toLowerCase() === value.toLowerCase()
      })
    }, 'Ya existe una carpeta con ese nombre'),
})

type CrearCarpetaForm = z.infer<typeof crearCarpetaSchema>

const { errors, defineField, handleSubmit, setValues } = useForm<CrearCarpetaForm>({
  validationSchema: toTypedSchema(crearCarpetaSchema),
  initialValues: {
    nombre: props.carpeta?.nombre ?? '',
  },
})

const [nombre, nomnbreAttrs] = defineField('nombre')

// const submit = handleSubmit(() => {
//   if (props.modo === "editar" && props.carpeta) {
//     store.editarCarpeta(props.carpeta.id, {
//       nombre: nombre.value
//     });
//     console.log("Se mando al submit editar");
//   } else {
//     store.agregarCarpeta({
//       id: Date.now(),
//       nombre: nombre.value,
//       fecha: new Date().toISOString(),
//       bancos: 0
//     });
//   }
//   modal.closeModal();

//   return true;
// });

// onMounted(() => {
//   modal.setSubmitFN(submit);
// });

// onBeforeUnmount(() => {
//   modal.setSubmitFN(null);
// });
// watch(
//   () => props.carpeta,
//   (carpeta) => {
//     if (props.modo === "editar" && carpeta) {
//       setValues({
//         nombre: carpeta.nombre
//       });
//     }
//   },
//   { immediate: true }
// );
</script>

<template>
  <!-- <h3 class="text-lg font-bold">Nueva carpeta</h3> -->
  <h3 class="text-lg font-bold">{{ modo === 'editar' ? 'Editar carpeta' : 'Nueva carpeta' }}</h3>

  <div class="py-4">
    <div class="w-full">
      <label class="relative block">
        <input
          v-model="nombre"
          v-bind="nomnbreAttrs"
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
      <!-- <p v-if="errors.nombre" class="text-error text-sm">{{ errors.nombre }}</p> -->
    </div>
  </div>
</template>
