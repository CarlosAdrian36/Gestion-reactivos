<template>
  <h3 class="text-lg font-bold mb-4">Crear usuario</h3>

  <div class="grid grid-cols-1 md:grid-cols-6 gap-x-4 gap-y-2">
    <!-- Fila 1 -->
    <div class="md:col-span-2">
      <!-- Nombre -->
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
          Nombre
        </span>
      </label>

      <p class="text-error text-sm mt-1 h-5">
        {{ errors.nombre }}
      </p>
    </div>

    <div class="md:col-span-2">
      <!-- Apellido Paterno -->
      <label class="relative block">
        <input
          v-model="apellidoPaterno"
          v-bind="apellidoPaternoAttrs"
          type="text"
          placeholder=" "
          class="peer w-full h-12 px-3 leading-5 bg-base-100 border border-neutral-400 rounded-md shadow-sm transition focus:shadow-none focus:border-primary focus:ring-1 focus:ring-primary/40 focus:outline-none"
        />

        <span
          class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600 bg-base-100 px-1 leading-none transition-all pointer-events-none peer-focus:top-0 peer-focus:text-xs peer-focus:text-primary peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:text-xs"
        >
          Apellido paterno
        </span>
      </label>

      <p class="text-error text-sm mt-1 h-5">
        {{ errors.apellidoPaterno }}
      </p>
    </div>

    <div class="md:col-span-2">
      <!-- Apellido Materno -->
      <label class="relative block">
        <input
          v-model="apellidoMaterno"
          v-bind="apellidoMaternoAttrs"
          type="text"
          placeholder=" "
          class="peer w-full h-12 px-3 leading-5 bg-base-100 border border-neutral-400 rounded-md shadow-sm transition focus:shadow-none focus:border-primary focus:ring-1 focus:ring-primary/40 focus:outline-none"
        />

        <span
          class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600 bg-base-100 px-1 leading-none transition-all pointer-events-none peer-focus:top-0 peer-focus:text-xs peer-focus:text-primary peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:text-xs"
        >
          Apellido materno
        </span>
      </label>
    </div>

    <!-- Fila 2 -->
    <div class="md:col-span-3">
      <!-- Nombre Usuario -->
      <label class="relative block">
        <input
          v-model="nombreUsuario"
          v-bind="nombreUsuarioAttrs"
          type="text"
          placeholder=" "
          class="peer w-full h-12 px-3 leading-5 bg-base-100 border border-neutral-400 rounded-md shadow-sm transition focus:shadow-none focus:border-primary focus:ring-1 focus:ring-primary/40 focus:outline-none"
        />

        <span
          class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600 bg-base-100 px-1 leading-none transition-all pointer-events-none peer-focus:top-0 peer-focus:text-xs peer-focus:text-primary peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:text-xs"
        >
          Nombre de usuario
        </span>
      </label>

      <p class="text-error text-sm mt-1 h-5">
        {{ errors.nombreUsuario }}
      </p>
    </div>

    <div class="md:col-span-3">
      <!-- Correo -->
      <label class="relative block">
        <input
          v-model="correo"
          v-bind="correoAttrs"
          type="email"
          placeholder=" "
          class="peer w-full h-12 px-3 leading-5 bg-base-100 border border-neutral-400 rounded-md shadow-sm transition focus:shadow-none focus:border-primary focus:ring-1 focus:ring-primary/40 focus:outline-none"
        />

        <span
          class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600 bg-base-100 px-1 leading-none transition-all pointer-events-none peer-focus:top-0 peer-focus:text-xs peer-focus:text-primary peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:text-xs"
        >
          Correo electrónico
        </span>
      </label>

      <p class="text-error text-sm mt-1 h-5">
        {{ errors.correo }}
      </p>
    </div>

    <!-- Fila 3 -->
    <div class="md:col-span-3">
      <!-- Rol -->
      <label class="form-control w-full">
        <span class="label-text mb-1">Rol</span>

        <select
          v-model="rol"
          v-bind="rolAttrs"
          class="select select-bordered w-full"
          v-for="value in roles"
        >
          <option value="">Seleccione un rol</option>
          <option value="Administrador">{{ value.nombre }}</option>
        </select>
      </label>

      <p class="text-error text-sm mt-1 h-5">
        {{ errors.rol }}
      </p>
    </div>

    <div class="md:col-span-3">
      <!-- Fecha Expiración -->
      <!-- <label class="form-control w-full">
        <span class="label-text mb-1">Fecha de expiración</span>

        <input
          v-model="fechaExpiracion"
          v-bind="fechaExpiracionAttrs"
          type="date"
          class="input input-bordered w-full"
        />
      </label>

      <p v-if="errors.fechaExpiracion" class="text-error text-sm mt-1">
        {{ errors.fechaExpiracion }}
      </p> -->
    </div>
    <!-- Fila 3 -->
    <div class="md:col-span-3">
      <div class="flex items-center gap-3 h-12">
        <span class="font-medium">Caducidad de la cuenta</span>

        <input v-model="tieneCaducidad" type="checkbox" class="toggle toggle-success" />
      </div>

      <div class="h-5"></div>
    </div>

    <div class="md:col-span-3">
      <Transition
        enter-active-class="transition-all duration-200"
        leave-active-class="transition-all duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-show="tieneCaducidad">
          <label class="form-control w-full">
            <span class="label-text mb-1"> Fecha de expiración </span>

            <input
              v-model="fechaExpiracion"
              v-bind="fechaExpiracionAttrs"
              type="date"
              class="input input-bordered w-full"
            />
          </label>

          <p class="text-error text-sm mt-1">
            {{ errors.fechaExpiracion }}
          </p>
        </div>
      </Transition>

      <!-- espacio reservado cuando está oculto -->
      <!-- <div v-show="!tieneCaducidad" class="h-18"></div> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import z from 'zod'
import { onMounted, onUnmounted, ref } from 'vue'
import { getRolesAction } from '@/api/usuarios/actions/get-roles.actions'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { saveUser } from '@/api/usuarios/actions/create-users.action'
import type { CreateUserRequest } from '@/api/usuarios/interfaces/createUser.interface'
const modal = useModalStore()
const usuarioSchema = z
  .object({
    nombreUsuario: z.string().trim().min(3, ' Al menos 3 caracteres'),
    vigencia: z.boolean(),
    correo: z.string().email('Correo invalido'),
    rol: z.string().trim().min(1, 'Debe seleccionar un rol'),
    nombre: z.string().trim().min(2, ' Es obligatorio'),
    apellidoPaterno: z.string().trim().min(2, 'ES obligatorio'),
    apellidoMaterno: z.string().trim().nullable().optional(),
    curp: z.string().trim().length(18, '').nullable().optional().or(z.literal('')),
    fechaExpiracion: z.string().nullable().optional(),
    tieneCaducidad: z.boolean(),
  })
  .refine(
    (data) => {
      if (!data.tieneCaducidad) return true
      return !!data.fechaExpiracion
    },
    {
      path: ['fechaExpiracion'],
      message: 'Debe seleccionar una fecha de expiracion',
    },
  )

const { handleSubmit, errors, defineField, isSubmitting } = useForm({
  validationSchema: toTypedSchema(usuarioSchema),

  initialValues: {
    nombreUsuario: '',
    vigencia: true,
    correo: '',
    rol: '',
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    curp: '',
    fechaExpiracion: '',
    tieneCaducidad: false,
  },
})

const [nombreUsuario, nombreUsuarioAttrs] = defineField('nombreUsuario')
const [correo, correoAttrs] = defineField('correo')
const [rol, rolAttrs] = defineField('rol')
const [nombre, nombreAttrs] = defineField('nombre')
const [apellidoPaterno, apellidoPaternoAttrs] = defineField('apellidoPaterno')
const [apellidoMaterno, apellidoMaternoAttrs] = defineField('apellidoMaterno')
// const [tieneCaducidadAttrs] = defineField('tieneCaducidad')
const [tieneCaducidad, tieneCaducidadAttrs] = defineField('tieneCaducidad')
const [curp, curpAttrs] = defineField('curp')
const [fechaExpiracion, fechaExpiracionAttrs] = defineField('fechaExpiracion')
const [vigencia, vigenciaAttrs] = defineField('vigencia')

const {
  data: roles,
  isLoading,
  error,
  isError,
} = useQuery({
  queryKey: ['Roles'],
  queryFn: () => getRolesAction(),
  staleTime: 1000 * 60, // 1 minutes
  refetchOnMount: true, // refetch si está stale al montar
  refetchOnWindowFocus: true, // refetch al volver a la pestaña
  refetchOnReconnect: true, // refetch al recuperar red
})
const createUserMutation = useMutation({
  mutationFn: saveUser,
})

import { toast } from 'vue-sonner'
import { useModalStore } from '@/common/modals/store/modal.store'

const onSubmit = handleSubmit(async (values) => {
  try {
    const payload: CreateUserRequest = {
      nombreUsuario: values.nombreUsuario,
      vigencia: values.vigencia,
      correo: values.correo,
      rol: values.rol,
      nombre: values.nombre,
      apellidoPaterno: values.apellidoPaterno,
      apellidoMaterno: values.apellidoMaterno || null,
      curp: values.curp || null,
      fechaExpiracion:
        values.tieneCaducidad && values.fechaExpiracion ? values.fechaExpiracion : null,
    }

    const response = await createUserMutation.mutateAsync(payload)

    console.log(response.cuenta.guid)

    toast.success('Usuario creado correctamente')

    // modal.closeModal()
  } catch (error) {
    toast.error(error instanceof Error ? error.message : 'Error al crear usuario')
  }
})

onMounted(() => {
  modal.setSubmitFN(onSubmit)
})

onUnmounted(() => {
  modal.setSubmitFN(null)
})
</script>
