<script lang="ts" setup>
import { computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { getBancosAction } from '@/api/bancos/actions/get-bancos.actions'
import type { Banco } from '@/api/bancos/interfaces/banco.interface'
import router from '@/router'
import DataTable from '@/app/common/components/table/DataTable.vue'
import type { DataTableColumns } from '@/app/common/components/table/features'

const { data: bancos, isLoading } = useQuery({
  queryKey: ['bancos'],
  queryFn: getBancosAction,
  staleTime: 1000 * 60,
  refetchOnMount: true,
  refetchOnWindowFocus: true,
  refetchOnReconnect: true,
})

const proyectos = computed(() => (bancos.value ?? []).filter((b) => b.esProyecto))

const columnas: DataTableColumns<Banco> = [
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
    id: 'contenido',
    accessorFn: (banco) => banco.cantidadReactivos,
    header: 'Contenidos',
    meta: { thClass: 'w-40 text-center', tdClass: 'text-center align-middle' },
  },
  {
    accessorKey: 'fechaModificacion',
    header: 'Última modificación',
    sortFn: 'datetime',
    sortDescFirst: true,
    meta: { thClass: 'w-52 text-center', tdClass: 'text-center align-middle' },
  },
  {
    id: 'acciones',
    header: 'Acciones',
    meta: { thClass: 'w-32 text-center', tdClass: 'text-center align-middle overflow-visible' },
  },
]

const goToItem = (item: Banco) => {
  if (item.esProyecto === true) {
    router.push({ name: 'bancoDetalle', params: { id: item.idBanco } })
  } else {
    console.log('Carpeta seleccionada:', item.nombre)
  }
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4">
    <!-- HEADER -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
      <div>
        <h1 class="text-2xl font-bold">Gestión de Proyectos</h1>

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
          <div class="flex items-center gap-2">
            <p class="font-semibold truncate" :title="row.nombre">
              {{ row.nombre }}
            </p>
          </div>

          <p class="text-sm text-base-content/60 truncate mt-1" :title="row.descripcion">
            {{ row.descripcion }}
          </p>
        </div>
      </template>

      <template #cell-contenido="{ row }">
        <div class="flex justify-center">
          <div class="badge badge-ghost">{{ row.cantidadReactivos }} reactivos</div>
        </div>
      </template>

      <template #cell-fechaModificacion="{ row }">
        <div class="flex flex-col">
          <span class="font-medium text-sm">
            {{
              new Date(row.fechaModificacion).toLocaleDateString('es-ES', {
                dateStyle: 'medium',
              })
            }}
          </span>
        </div>
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
            <li>
              <a>
                <i class="fa-regular fa-eye"></i>
                Ver
              </a>
            </li>

            <li>
              <a>
                <i class="fa-regular fa-pen"></i>
                Editar
              </a>
            </li>
            <li>
              <a>
                <i class="fa-regular fa-pen"></i>
                Compartir
              </a>
            </li>

            <li>
              <a>
                <i class="fa-regular fa-copy"></i>
                Copiar
              </a>
            </li>

            <div class="divider my-1"></div>

            <li>
              <a class="text-error">
                <i class="fa-regular fa-trash"></i>
                Eliminar
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

          <h2 class="text-lg font-bold">No hay elementos</h2>

          <p class="text-sm text-base-content/60 mt-1">
            Puedes crear un banco de reactivos con flujo de trabajo para comenzar
          </p>

          <button class="btn btn-primary mt-5">
            <i class="fa-regular fa-plus"></i>
            Crear elemento
          </button>
        </div>
      </template>
    </DataTable>
  </div>
</template>
