<script lang="ts" setup generic="T extends RowData">
import { computed, ref, watch } from 'vue'
import { FlexRender, useTable } from '@tanstack/vue-table'
import type { Column, RowData } from '@tanstack/vue-table'
import { dataTableFeatures, type DataTableColumns, type DataTableFeatures } from './features'

interface Props {
  data?: T[]
  columns: DataTableColumns<T>
  isLoading?: boolean
  pageSize?: number
  placeholder?: string
  containerClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  pageSize: 10,
  placeholder: 'Buscar...',
  containerClass: 'rounded-box border border-base-300 bg-base-100 shadow-sm overflow-visible',
})

const emit = defineEmits<{
  'row-click': [row: T]
}>()

defineSlots<{
  toolbar?: () => unknown
  empty?: () => unknown
  [key: `header-${string}`]: (props: { column: Column<DataTableFeatures, T> }) => unknown
  [key: `cell-${string}`]: (props: { row: T; value: unknown }) => unknown
}>()

const busqueda = ref('')

const datos = computed(() => props.data ?? [])
const columnas = computed(() => props.columns)

const table = useTable<DataTableFeatures, T>({
  features: dataTableFeatures,
  columns: columnas,
  data: datos,
  globalFilterFn: 'includesString',
  initialState: {
    pagination: {
      pageIndex: 0,
      pageSize: props.pageSize,
    },
  },
})

watch(busqueda, (valor) => table.setGlobalFilter(valor))

const filasVisibles = computed(() => table.getRowModel().rows.length)
const hayDatos = computed(() => (props.data?.length ?? 0) > 0)
const indicePagina = computed(() => table.atoms.pagination.get().pageIndex)
const tamanioPagina = computed(() => table.atoms.pagination.get().pageSize)
const totalPaginas = computed(() => table.getPageCount())
const totalFilas = computed(() => table.getFilteredRowModel().rows.length)
const totalColumnas = computed(() => table.getAllLeafColumns().length)

const rangoInicio = computed(() =>
  filasVisibles.value === 0 ? 0 : indicePagina.value * tamanioPagina.value + 1,
)
const rangoFin = computed(() =>
  filasVisibles.value === 0 ? 0 : rangoInicio.value + filasVisibles.value - 1,
)

const paginasVisibles = computed(() => {
  const total = totalPaginas.value
  const actual = indicePagina.value + 1
  const inicio = Math.max(1, Math.min(actual - 2, total - 4))
  const fin = Math.min(total, inicio + 4)
  return Array.from({ length: fin - inicio + 1 }, (_, i) => inicio + i)
})

function iconoSort(column: Column<DataTableFeatures, T>): string {
  const dir = column.getIsSorted()
  if (dir === 'asc') return 'fa-solid fa-sort-up'
  if (dir === 'desc') return 'fa-solid fa-sort-down'
  return 'fa-solid fa-sort text-base-content/30'
}
</script>

<template>
  <div :class="containerClass">
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b border-base-300"
    >
      <label class="input input-bordered flex items-center gap-2 w-full sm:max-w-xs min-w-0">
        <i class="fa-regular fa-magnifying-glass text-base-content/40 text-sm"></i>
        <input v-model="busqueda" type="text" class="grow" :placeholder="placeholder" />
        <button
          v-if="busqueda"
          class="btn btn-ghost btn-xs btn-circle"
          @click="busqueda = ''"
        >
          <i class="fa-solid fa-xmark"></i>
        </button>
      </label>

      <div class="flex items-center gap-2">
        <slot name="toolbar"></slot>
      </div>
    </div>

    <div class="overflow-visible">
      <div v-if="isLoading" class="p-6 space-y-3">
        <div class="skeleton h-14 w-full"></div>
        <div class="skeleton h-16 w-full"></div>
        <div class="skeleton h-16 w-full"></div>
        <div class="skeleton h-16 w-full"></div>
      </div>

      <table v-else class="table table-fixed w-full block overflow-x-auto whitespace-nowrap">
        <thead class="bg-base-200">
          <tr>
            <th
              v-for="header in table.getHeaderGroups()[0]?.headers ?? []"
              :key="header.id"
              :class="[
                header.column.columnDef.meta?.thClass,
                { 'cursor-pointer select-none': header.column.getCanSort() },
              ]"
              @click="header.column.getToggleSortingHandler()?.($event)"
            >
              <span class="inline-flex items-center gap-1">
                <slot :name="`header-${header.column.id}`" :column="header.column">
                  <FlexRender
                    v-if="typeof header.column.columnDef.header === 'function'"
                    :header="header"
                  />
                  <template v-else>{{ header.column.columnDef.header }}</template>
                </slot>
                <i v-if="header.column.getCanSort()" :class="iconoSort(header.column)"></i>
              </span>
            </th>
          </tr>
        </thead>

        <tbody v-if="filasVisibles > 0">
          <tr
            v-for="row in table.getRowModel().rows"
            :key="row.id"
            class="hover transition-colors cursor-pointer"
            @click="emit('row-click', row.original)"
          >
            <td
              v-for="cell in row.getAllCells()"
              :key="cell.id"
              :class="cell.column.columnDef.meta?.tdClass"
            >
              <slot
                :name="`cell-${cell.column.id}`"
                :row="row.original"
                :value="cell.getValue()"
              >
                <FlexRender v-if="cell.column.columnDef.cell" :cell="cell" />
                <template v-else>{{ cell.getValue() }}</template>
              </slot>
            </td>
          </tr>
        </tbody>

        <tbody v-else-if="hayDatos">
          <tr>
            <td :colspan="totalColumnas">
              <div class="flex flex-col items-center py-16">
                <i class="fa-regular fa-magnifying-glass text-4xl text-base-content/40"></i>

                <h2 class="text-lg font-bold mt-4">Sin resultados</h2>

                <p class="text-sm text-base-content/60 mt-1">
                  No hay elementos que coincidan con "{{ busqueda }}"
                </p>

                <button class="btn bg-base-100 mt-5" @click="busqueda = ''">
                  <i class="fa-regular fa-xmark"></i>
                  Limpiar búsqueda
                </button>
              </div>
            </td>
          </tr>
        </tbody>

        <tbody v-else>
          <tr>
            <td :colspan="totalColumnas">
              <slot name="empty">
                <div class="flex flex-col items-center py-16">
                  <div
                    class="w-20 h-20 rounded-full bg-base-200 flex items-center justify-center mb-4"
                  >
                    <i class="fa-regular fa-inbox text-4xl text-base-content/40"></i>
                  </div>

                  <h2 class="text-lg font-bold">No hay elementos</h2>

                  <p class="text-sm text-base-content/60 mt-1">No se encontraron registros</p>
                </div>
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-if="!isLoading && totalPaginas > 1"
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-t border-base-300"
    >
      <span class="text-sm text-base-content/60">
        Mostrando {{ rangoInicio }}–{{ rangoFin }} de {{ totalFilas }} elementos
      </span>

      <div class="join">
        <button
          class="btn join-item btn-sm"
          :disabled="!table.getCanPreviousPage()"
          @click="table.firstPage()"
        >
          «
        </button>
        <button
          class="btn join-item btn-sm"
          :disabled="!table.getCanPreviousPage()"
          @click="table.previousPage()"
        >
          ‹
        </button>
        <button
          v-for="pagina in paginasVisibles"
          :key="pagina"
          class="btn join-item btn-sm"
          :class="{ 'btn-primary': pagina === indicePagina + 1 }"
          @click="table.setPageIndex(pagina - 1)"
        >
          {{ pagina }}
        </button>
        <button
          class="btn join-item btn-sm"
          :disabled="!table.getCanNextPage()"
          @click="table.nextPage()"
        >
          ›
        </button>
        <button
          class="btn join-item btn-sm"
          :disabled="!table.getCanLastPage()"
          @click="table.lastPage()"
        >
          »
        </button>
      </div>
    </div>
  </div>
</template>
