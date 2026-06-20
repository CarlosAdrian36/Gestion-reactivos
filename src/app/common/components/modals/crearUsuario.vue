<template>
  <h3 class="text-lg font-bold mb-4">Crear usuario</h3>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
    <!-- Nombre Usuario -->
    <div>
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

    <!-- Correo -->
    <div>
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

    <!-- Nombre -->
    <div>
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

    <!-- Apellido Paterno -->
    <div>
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

    <!-- Apellido Materno -->
    <div>
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

    <!-- CURP -->
    <div>
      <label class="relative block">
        <input
          v-model="curp"
          v-bind="curpAttrs"
          type="text"
          maxlength="18"
          placeholder=" "
          class="peer w-full h-12 px-3 leading-5 bg-base-100 border border-neutral-400 rounded-md shadow-sm transition focus:shadow-none focus:border-primary focus:ring-1 focus:ring-primary/40 focus:outline-none"
        />

        <span
          class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600 bg-base-100 px-1 leading-none transition-all pointer-events-none peer-focus:top-0 peer-focus:text-xs peer-focus:text-primary peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:text-xs"
        >
          CURP
        </span>
      </label>

      <p v-if="errors.curp" class="text-error text-sm mt-1">
        {{ errors.curp }}
      </p>
    </div>

    <!-- Rol -->
    <div>
      <label class="form-control w-full">
        <span class="label-text mb-1">Rol</span>

        <select v-model="rol" v-bind="rolAttrs" class="select select-bordered w-full">
          <option value="">Seleccione un rol</option>
          <option value="Administrador">Administrador</option>
          <option value="SuperAdministrador">Super Administrador</option>
          <option value="Usuario">Usuario</option>
        </select>
      </label>

      <p class="text-error text-sm mt-1 h-5">
        {{ errors.rol }}
      </p>
    </div>

    <!-- Fecha Expiración -->
    <div>
      <label class="form-control w-full">
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
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import z from 'zod'

const usuarioSchema = z.object({
  nombreUsuario: z.string().trim().min(3, ' Al menos 3 caracteres'),
  vigencia: z.boolean(),
  correo: z.string().email('Correo invalido'),
  rol: z.string().trim().min(1, 'Debe seleccionar un rol'),
  nombre: z.string().trim().min(2, ' Es obligatorio'),
  apellidoPaterno: z.string().trim().min(2, 'ES obligatorio'),
  apellidoMaterno: z.string().trim().nullable().optional(),
  curp: z.string().trim().length(18, '').nullable().optional().or(z.literal('')),
  fechaExpiracion: z.string().nullable().optional(),
})
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
  },
})

const [nombreUsuario, nombreUsuarioAttrs] = defineField('nombreUsuario')
const [correo, correoAttrs] = defineField('correo')
const [rol, rolAttrs] = defineField('rol')
const [nombre, nombreAttrs] = defineField('nombre')
const [apellidoPaterno, apellidoPaternoAttrs] = defineField('apellidoPaterno')
const [apellidoMaterno, apellidoMaternoAttrs] = defineField('apellidoMaterno')
const [curp, curpAttrs] = defineField('curp')
const [fechaExpiracion, fechaExpiracionAttrs] = defineField('fechaExpiracion')
const [vigencia, vigenciaAttrs] = defineField('vigencia')
</script>
