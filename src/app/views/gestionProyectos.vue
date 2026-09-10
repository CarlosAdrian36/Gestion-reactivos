<script lang="ts" setup>
import { useQuery } from '@tanstack/vue-query'
import { getProyectosAction } from '@/api/proyectos/actions/get-proyectos.actions'
import type { BancoProyecto } from '@/api/proyectos/interfaces/proyecto.interface'
import router from '@/router'
import DataTable from '@/app/common/components/table/DataTable.vue'
import type { DataTableColumns } from '@/app/common/components/table/features'
import WorkflowStepper from '@/app/common/components/WorkflowStepper.vue'

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
    id: 'flujo',
    accessorFn: (p) => `${p.fase.nombre}-${p.estado.nombre}`,
    header: 'Flujo de trabajo',
    meta: { thClass: 'w-80 text-center', tdClass: 'text-center align-middle' },
  },
  {
    accessorKey: 'fechaModificacion',
    header: 'Ultima modificacion',
    sortFn: 'datetime',
    sortDescFirst: true,
    meta: { thClass: 'w-44 text-center', tdClass: 'text-center align-middle' },
  },
  {
    id: 'acciones',
    header: 'Acciones',
    meta: { thClass: 'w-24 text-center', tdClass: 'text-center align-middle overflow-visible' },
  },
]

const goToItem = (item: BancoProyecto) => {
  router.push({ name: 'bancoDetalle', params: { id: item.idBanco } })
}

function getStepIndex(fase: string): number {
  switch (fase) {
    case 'Construccion':
      return 0
    case 'Revision':
      return 1
    case 'Traduccion':
      return 2
    case 'Revision traduccion':
      return 3
    case 'Finalizado':
      return 4
    default:
      return 0
  }
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
      <div>
        <h1 class="text-2xl font-bold">Gestion de Proyectos</h1>
        <p class="text-sm text-base-content/70">
          Administra bancos de reactivos con flujos de trabajo
        </p>
      </div>
      <div class="flex items-center gap-2">
        <button class="btn btn-primary">
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

      <template #cell-flujo="{ row }">
        <WorkflowStepper
          :current-step-index="getStepIndex(row.fase.nombre)"
          :current-label="row.fase.nombre"
          :current-status="row.estado.nombre"
          :completed="row.fase.nombre === 'Finalizado' && row.estado.nombre === 'Completada'"
        />
      </template>

      <template #cell-fechaModificacion="{ row }">
        <span class="text-sm">
          {{ new Date(row.fechaModificacion).toLocaleDateString('es-ES', { dateStyle: 'medium' }) }}
        </span>
      </template>

      <template #cell-acciones>
        <div class="dropdown dropdown-end dropdown-left">
          <div tabindex="0" role="button" class="btn btn-ghost btn-sm btn-circle">
            <i class="fa-regular fa-ellipsis-vertical"></i>
          </div>
          <ul
            tabindex="0"
            class="dropdown-content menu bg-base-100 rounded-2xl w-52 p-2 shadow-xl border border-base-300"
          >
            <li><a><i class="fa-regular fa-eye"></i>Ver</a></li>
            <li><a><i class="fa-regular fa-pen"></i>Editar</a></li>
            <li><a><i class="fa-regular fa-pen"></i>Compartir</a></li>
            <li><a><i class="fa-regular fa-copy"></i>Copiar</a></li>
            <div class="divider my-1"></div>
            <li><a class="text-error"><i class="fa-regular fa-trash"></i>Eliminar</a></li>
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
          <button class="btn btn-primary mt-5">
            <i class="fa-regular fa-plus"></i>
            Crear proyecto
          </button>
        </div>
      </template>
    </DataTable>
  </div>
</template>
