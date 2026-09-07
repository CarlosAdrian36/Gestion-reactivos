<template>
  <div class="max-w-7xl mx-auto px-4">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
      <div>
        <h1 class="text-2xl font-bold">Gestión de Usuarios</h1>

        <p class="text-sm text-base-content/70">Administra usuarios dentro del sistema</p>
      </div>

      <div class="flex items-center gap-2">
        <button class="btn btn-primary" @click="NuevoUsuario()">
          <i class="fa-regular fa-user"></i>
          Nuevo Usuario
        </button>
      </div>
    </div>

    <DataTable :data="data" :columns="columnas" :is-loading="isLoading">
      <template #cell-acciones="{ row }">
        <div class="flex gap-2">
          <div class="tooltip" data-tip="Reenviar Correo">
            <button class="btn btn-soft btn-success">
              <i class="fa-regular fa-rotate-right"></i>
            </button>
          </div>
          <div class="tooltip" data-tip="Editar">
            <button class="btn btn-soft btn-info" @click="editarUsuario(row)">
              <i class="fa-regular fa-pen-to-square"></i>
            </button>
          </div>
          <div class="tooltip" data-tip="Eliminar">
            <button class="btn btn-soft btn-error" @click="eliminarUsuario(row)">
              <i class="fa-regular fa-trash"></i>
            </button>
          </div>
        </div>
      </template>

      <template #empty>
        <div class="flex flex-col items-center py-16">
          <div
            class="w-20 h-20 rounded-full bg-base-200 flex items-center justify-center mb-4"
          >
            <i class="fa-regular fa-user text-4xl text-base-content/40"></i>
          </div>

          <h2 class="text-lg font-bold">No hay usuarios</h2>

          <p class="text-sm text-base-content/60 mt-1">
            Puedes crear un usuario para visualizarlo aqui
          </p>

          <div class="flex items-center gap-2 mt-5">
            <button class="btn bg-white" @click="NuevoUsuario()">
              <i class="fa-regular fa-user"></i>
              Nuevo Usuario
            </button>
          </div>
        </div>
      </template>
    </DataTable>
  </div>
</template>
<script lang="ts" setup>
import { getUsuariosAction } from '@/api/usuarios/actions/get-usuarios.actions'
import { useModalStore } from '@/common/modals/store/modal.store'
import { useQuery } from '@tanstack/vue-query'
import CrearUsuario from '../common/components/modals/crearUsuario.vue'
import EliminarUsuario from '../common/components/modals/eliminarUsuario.vue'
import type { Cuenta } from '@/api/usuarios/interfaces/ususarios.interface'
import DataTable from '@/app/common/components/table/DataTable.vue'
import type { DataTableColumns } from '@/app/common/components/table/features'

const { data, isLoading } = useQuery({
  queryKey: ['usuarios'],
  queryFn: () => getUsuariosAction(),
  staleTime: 1000 * 60, // 1 minutes
  refetchOnMount: true, // refetch si está stale al montar
  refetchOnWindowFocus: true, // refetch al volver a la pestaña
  refetchOnReconnect: true, // refetch al recuperar red
})

const columnas: DataTableColumns<Cuenta> = [
  {
    accessorKey: 'nombreUsuario',
    header: 'Usuario',
    meta: { thClass: 'w-40 text-center align-middle', tdClass: 'text-center align-middle' },
  },
  {
    id: 'nombre',
    accessorFn: (cuenta) =>
      `${cuenta.identidad.nombre} ${cuenta.identidad.apellidoPaterno} ${cuenta.identidad.apellidoMaterno}`,
    header: 'Nombre',
    meta: { thClass: 'w-40 text-center align-middle', tdClass: 'text-center align-middle' },
  },
  {
    id: 'correo',
    accessorFn: (cuenta) => cuenta.correos[0]?.direccion ?? 'Sin correo',
    header: 'Correo electrónico',
    meta: { thClass: 'w-40 text-center align-middle', tdClass: 'text-center align-middle' },
  },
  {
    id: 'rol',
    accessorFn: (cuenta) => cuenta.roles[0]?.nombre ?? 'Sin rol',
    header: 'Rol',
    meta: { thClass: 'w-20 text-center align-middle', tdClass: 'text-center align-middle' },
  },
  {
    id: 'acciones',
    header: 'Acciones',
    meta: { thClass: 'w-32 text-center', tdClass: 'text-center align-middle' },
  },
]

const modal = useModalStore()

function NuevoUsuario() {
  modal.openModal(
    CrearUsuario,
    {},
    [
      { label: 'Cerrar', variant: 'outline' },
      { label: 'Guardar', variant: 'primary', type: 'submit' },
    ],
    'max-w-5xl',
  )
}

function editarUsuario(usuario: Cuenta) {
  modal.openModal(
    CrearUsuario,
    { usuario },
    [
      { label: 'Cerrar', variant: 'outline' },
      { label: 'Guardar', variant: 'primary', type: 'submit' },
    ],
    'max-w-5xl',
  )
}

function eliminarUsuario(usuario: Cuenta) {
  modal.openModal(
    EliminarUsuario,
    { usuario },
    [
      { label: 'Cancelar', variant: 'outline' },
      { label: 'Eliminar', variant: 'error', type: 'submit' },
    ],
    'max-w-md',
  )
}
</script>
