<template>
  <div class="max-w-7xl max-auto px-4">
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
    <div class="rounded-2xl border border-base-300 bg-base-100 shadow-sm overflow-visible">
      <div class="overflow-visible">
        <div v-if="isLoading" class="p-6 space-y-3">
          <div class="skeleton h-14 w-full"></div>
          <div class="skeleton h-16 w-full"></div>
          <div class="skeleton h-16 w-full"></div>
          <div class="skeleton h-16 w-full"></div>
        </div>
        <!-- TABLE 1 -->
        <table v-else class="table table-fixed w-full block overflow-x-auto whitespace-nowrap">
          <!-- HEAD -->
          <thead class="bg-base-200">
            <tr>
              <th class="w-40 text-center align-middle">ID de ususario</th>

              <th class="w-40 text-center align-middle">Nombre</th>

              <th class="w-40 text-center align-middle">Correo electrónico</th>

              <th class="w-20 text-center align-middle">Rol</th>

              <!-- <th class="w-10 text-center">Compartido</th> -->

              <th class="w-32 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody v-if="data && data?.length > 0">
            <tr
              v-for="value in data"
              :key="value.guid"
              class="hover transition-colors cursor-pointers"
            >
              <!-- Id -->
              <td class="text-center align-middle">
                {{ value.nombreUsuario }}
              </td>

              <!-- Nombre -->
              <td class="text-center align-middle">
                {{ value.identidad.nombre }} {{ value.identidad.apellidoPaterno }}
                {{ value.identidad.apellidoMaterno }}
              </td>

              <td class="text-center align-middle">
                {{ value.correos[0]?.direccion ?? 'Sin correo' }}
              </td>
              <td class="text-center align-middle">
                {{ value.roles[0]?.nombre ?? 'Sin rol' }}
              </td>
              <td class="text-center align-middle">
                <div class="flex gap-2">
                  <div class="tooltip" data-tip="Reenviar Correo">
                    <button class="btn btn-success">
                      <i class="fa-regular fa-rotate-right"></i>
                    </button>
                  </div>
                  <div class="tooltip" data-tip="Editar">
                    <button class="btn btn-info">
                      <i class="fa-regular fa-pen-to-square"></i>
                    </button>
                  </div>
                  <div class="tooltip" data-tip="Eliminar">
                    <button class="btn btn-error">
                      <i class="fa-regular fa-trash"></i>
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="5">
                <div class="flex flex-col items-center py-16">
                  <div
                    class="w-20 h-20 rounded-full bg-base-200 flex items-center justify-center mb-4"
                  >
                    <i class="fa-regular fa-user text-4xl text-base-content/40"></i>
                  </div>

                  <h2 class="text-lg font-bold">No hay ususarios</h2>

                  <p class="text-sm text-base-content/60 mt-1">
                    Puedes crear un usuario para visualizarlo aqui
                  </p>

                  <div class="flex items-center gap-2 mt-5">
                    <button class="btn bg-white" @click="">
                      <i class="fa-regular fa-user"></i>
                      Nuevo Usuario
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { getUsuariosAction } from '@/api/usuarios/actions/get-usuarios.actions'
import { useModalStore } from '@/common/modals/store/modal.store'
import { useQuery } from '@tanstack/vue-query'
import CrearUsuario from '../common/components/modals/crearUsuario.vue'

const { data, isLoading } = useQuery({
  queryKey: ['Compartidos'],
  queryFn: () => getUsuariosAction(),
  staleTime: 1000 * 60,
})

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
</script>
