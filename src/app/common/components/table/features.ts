import {
  columnFilteringFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_includesString,
  globalFilteringFeature,
  metaHelper,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_datetime,
  tableFeatures,
} from '@tanstack/vue-table'
import type { ColumnDef, RowData } from '@tanstack/vue-table'

export interface DaisyColumnMeta {
  thClass?: string
  tdClass?: string
}

export const dataTableFeatures = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  filterFns: { includesString: filterFn_includesString },
  filteredRowModel: createFilteredRowModel(),
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric, datetime: sortFn_datetime },
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
  columnMeta: metaHelper<DaisyColumnMeta>(),
})

export type DataTableFeatures = typeof dataTableFeatures

export type DataTableColumns<T extends RowData> = ColumnDef<DataTableFeatures, T>[]
