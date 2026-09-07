<template>
  <div class="max-w-7xl mx-auto px-4">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
      <div>
        <h1 class="text-2xl font-bold">Gestión de Bancos Compartidos</h1>

        <p class="text-sm text-base-content/70">Administra carpetas y bancos de reactivos</p>
      </div>
    </div>

    <DataTable :data="data" :columns="columnas" :is-loading="isLoading" @row-click="irABanco">
      <template #cell-tipo>
        <div
          class="w-10 h-10 rounded-xl flex items-center justify-center mx-auto bg-primary/10"
        >
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

          <p
            v-if="row.descripcion"
            class="text-sm text-base-content/60 truncate mt-1"
            :title="row.descripcion"
          >
            {{ row.descripcion }}
          </p>
        </div>
      </template>

      <template #cell-contenido="{ row }">
        <div class="flex justify-center text-base-content/60">
          <div class="inline-flex items-center min-w-30">
            <span class="w-12 text-right font-mono">
              {{ row.cantidadReactivos || 0 }}
            </span>

            <span class="ml-2 text-left"> reactivos </span>
          </div>
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
        <span class="text-sm text-base-content/60">
          {{
            new Date(row.fechaModificacion).toLocaleTimeString('es-ES', {
              timeStyle: 'short',
            })
          }}
        </span>
      </template>

      <template #empty>
        <div class="flex flex-col items-center py-16">
          <div
            class="w-20 h-20 rounded-full bg-base-200 flex items-center justify-center mb-4"
          >
            <i class="fa-regular fa-file-export text-4xl text-base-content/40"></i>
          </div>

          <h2 class="text-lg font-bold">No hay bancos compartidos contigo</h2>

          <p class="text-sm text-base-content/60 mt-1">
            Aqui puedes visualizar los bancos compartidos contigo
          </p>
        </div>
      </template>
    </DataTable>
  </div>
</template>

<script lang="ts" setup>
import { getBancosCompartidosAction } from '@/api/bancos/compartidos/actions/get-bancosCompartidos.action'
import { useQuery } from '@tanstack/vue-query'
import { useRouter } from 'vue-router'
import DataTable from '@/app/common/components/table/DataTable.vue'
import type { DataTableColumns } from '@/app/common/components/table/features'
import type { Banco } from '@/api/bancos/interfaces/banco.interface'

const router = useRouter()

const { data, isLoading } = useQuery({
  queryKey: ['Compartidos'],
  queryFn: () => getBancosCompartidosAction(),
})

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
    header: 'Contenido',
    meta: { thClass: 'w-40 text-center', tdClass: 'text-center align-middle' },
  },
  {
    accessorKey: 'fechaModificacion',
    header: 'Última modificación',
    sortFn: 'datetime',
    sortDescFirst: true,
    meta: { thClass: 'w-52 text-center', tdClass: 'text-center align-middle' },
  },
]

function irABanco(banco: Banco) {
  router.push({
    name: 'bancoDetalle',
    params: { id: banco.idBanco },
    query: { origen: 'compartidos' },
  })
}
</script>
