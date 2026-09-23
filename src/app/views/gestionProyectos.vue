<script lang="ts" setup>
import { useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'
import { getProyectosAction } from '@/api/proyectos/actions/get-proyectos.actions'
import type { BancoProyecto } from '@/api/proyectos/interfaces/proyecto.interface'
import router from '@/router'
import DataTable from '@/app/common/components/table/DataTable.vue'
import type { DataTableColumns } from '@/app/common/components/table/features'
import WorkflowStepper from '@/app/common/components/WorkflowStepper.vue'
import NuevoProyecto from '@/app/common/components/modals/nuevoProyecto.vue'
import EliminarProyecto from '@/app/common/components/modals/eliminarProyecto.vue'
import { useModalStore } from '@/common/modals/store/modal.store'
import { useAuthStore } from '@/auth/store/auth.store'
import banderaUs from '@/assets/banderas/us.png'
import banderaFr from '@/assets/banderas/fr.png'

const modal = useModalStore()
const authStore = useAuthStore()

const puedeEliminarProyectos = computed(
  () =>
    authStore.user?.roles.some((rol) => rol.nombre.trim().toLowerCase() === 'administrador') ??
    false,
)

function abrirModalProyecto() {
  modal.openModal(NuevoProyecto, {}, [
    { label: 'Cerrar', variant: 'outline' },
    { label: 'Guardar', variant: 'primary', type: 'submit' },
  ])
}
function closeDropdown() {
  ;(document.activeElement as HTMLElement)?.blur()
}
function abrirModalEliminarProyecto(proyecto: BancoProyecto) {
  closeDropdown()
  modal.openModal(
    EliminarProyecto,
    { proyecto },
    [
      { label: 'Cancelar', variant: 'outline' },
      { label: 'Eliminar', variant: 'error', type: 'submit' },
    ],
    'max-w-md',
  )
}

const { data: proyectos, isLoading } = useQuery({
  queryKey: ['proyectos'],
  queryFn: getProyectosAction,
  staleTime: 1000 * 60,
  refetchOnMount: true,
  refetchOnWindowFocus: true,
  refetchOnReconnect: true,
})

const columnas: DataTableColumns<BancoProyecto> = [
  {
    id: 'tipo',
    header: 'Tipo',
    meta: { thClass: 'w-16 text-center', tdClass: 'text-center align-middle' },
  },
  {
    accessorKey: 'nombre',
    header: 'Nombre',
    meta: { thClass: 'min-w-62.5', tdClass: 'align-middle' },
  },
  {
    id: 'idiomas',
    accessorFn: (p) => p.idiomas.filter((i) => i.etiqueta !== 'es_MX').length,
    header: 'Idiomas',
    meta: { thClass: 'w-32 text-center', tdClass: 'text-center align-middle' },
  },
  {
    id: 'flujo',
    accessorFn: (p) => {
      const faseActual = p.fases.find((f) => f.estado === 'En proceso')
      return faseActual ? `${faseActual.nombre}-${p.estado.nombre}` : p.estado.nombre
    },
    header: 'Flujo de trabajo',
    meta: { thClass: 'w-80 text-center', tdClass: 'text-center align-middle' },
  },
  {
    id: 'acciones',
    header: 'Acciones',
    meta: { thClass: 'w-24 text-center', tdClass: 'text-center align-middle overflow-visible' },
  },
]

const goToItem = (item: BancoProyecto) => {
  router.push({ name: 'bancoDetalle', params: { id: item.idProyecto } })
}

function getBandera(etiqueta: string): string {
  switch (etiqueta) {
    case 'en_US':
      return banderaUs
    case 'fr_FR':
      return banderaFr
    default:
      return ''
  }
}
</script>

<template>
  <div class="max-w-9xl mx-auto">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
      <div>
        <h1 class="text-2xl font-bold">Gestion de Proyectos</h1>
        <p class="text-sm text-base-content/70">
          Administra bancos de reactivos con flujos de trabajo
        </p>
      </div>
      <div class="flex items-center gap-2">
        <button class="btn btn-primary" @click="abrirModalProyecto">
          <i class="fa-regular fa-plus"></i>
          Crear
        </button>
      </div>
    </div>

    <DataTable :data="proyectos" :columns="columnas" :is-loading="isLoading" @row-click="goToItem">
      <template #cell-tipo>
        <div class="w-10 h-10 rounded-xl flex items-center justify-center mx-auto bg-primary/10">
          <i class="fa-regular fa-file-lines text-primary text-lg"></i>
        </div>
      </template>

      <template #cell-nombre="{ row }">
        <div class="min-w-0">
          <p class="font-semibold truncate" :title="row.nombre">{{ row.nombre }}</p>
          <p class="text-sm text-base-content/60 truncate mt-1" :title="row.descripcion">
            {{ row.descripcion }}
          </p>
        </div>
      </template>

      <template #cell-idiomas="{ row }">
        <div class="flex justify-center gap-1">
          <img
            v-for="idioma in row.idiomas.filter((i) => i.etiqueta !== 'es_MX')"
            :key="idioma.etiqueta"
            :src="getBandera(idioma.etiqueta)"
            :alt="idioma.descripcion"
            class="w-6 h-4 object-contain"
            :title="idioma.descripcion"
          />
          <span
            v-if="row.idiomas.filter((i) => i.etiqueta !== 'es_MX').length === 0"
            class="text-base-content/40 text-sm"
            >-</span
          >
        </div>
      </template>

      <template #cell-flujo="{ row }">
        <WorkflowStepper :fases="row.fases" :estado="row.estado" />
      </template>

      <template #cell-acciones="{ row }">
        <div class="dropdown dropdown-end dropdown-left" @click.stop>
          <div tabindex="0" role="button" class="btn btn-ghost btn-sm btn-circle">
            <i class="fa-regular fa-ellipsis-vertical"></i>
          </div>
          <ul
            tabindex="0"
            class="dropdown-content menu bg-base-100 rounded-2xl w-52 p-2 shadow-xl border border-base-300"
          >
            <li>
              <a><i class="fa-regular fa-eye"></i>Ver</a>
            </li>
            <li>
              <a><i class="fa-regular fa-pen"></i>Editar</a>
            </li>
            <li>
              <a><i class="fa-regular fa-pen"></i>Compartir</a>
            </li>
            <li>
              <a><i class="fa-regular fa-copy"></i>Copiar</a>
            </li>
            <div v-if="puedeEliminarProyectos" class="divider my-1"></div>
            <li v-if="puedeEliminarProyectos">
              <a class="text-error" @click="abrirModalEliminarProyecto(row)">
                <i class="fa-regular fa-trash"></i>Eliminar
              </a>
            </li>
          </ul>
        </div>
      </template>

      <template #empty>
        <div class="flex flex-col items-center py-16">
          <div class="w-20 h-20 rounded-full bg-base-200 flex items-center justify-center mb-4">
            <i class="fa-regular fa-file-lines text-4xl text-base-content/40"></i>
          </div>
          <h2 class="text-lg font-bold">No hay proyectos</h2>
          <p class="text-sm text-base-content/60 mt-1">
            Puedes crear un banco de reactivos con flujo de trabajo para comenzar
          </p>
          <button class="btn btn-primary mt-5" @click="abrirModalProyecto">
            <i class="fa-regular fa-plus"></i>
            Crear proyecto
          </button>
        </div>
      </template>
    </DataTable>
  </div>
</template>
