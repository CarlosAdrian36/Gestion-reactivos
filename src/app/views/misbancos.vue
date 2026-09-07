<script lang="ts" setup>
import { useMediaQuery } from '@vueuse/core'
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { useRouter } from 'vue-router'
import { computed, ref } from 'vue'
import { toast } from 'vue-sonner'

import { getItemsUnificadosAction } from '@/app/unifiacados/actions/get-items-unificados.actions'
import { moveBancoCarpeta } from '@/api/carpetas/actions/move-riaz-carpeta.action.ts'

import { useCarpetas } from '@/api/carpetas/composable/useCarpetas.ts'

import CrearCarpeta from '../common/components/modals/crearCarpeta.vue'
import eliminarCarpeta from '../common/components/modals/eliminarCarpeta.vue'
import NuevoBanco from '../common/components/modals/nuevoBanco.vue'
import eliminarBanco from '../common/components/modals/eliminarBanco.vue'

import { useModalStore } from '@/common/modals/store/modal.store'
import type { ItemUnificado } from '../unifiacados/interface/item-unificado.interface'
import CompartirBanco from '../common/components/modals/CompartirBanco.vue'
import DataTable from '@/app/common/components/table/DataTable.vue'
import type { DataTableColumns } from '@/app/common/components/table/features'

const modal = useModalStore()

const { data, isLoading } = useQuery({
  queryKey: ['items-unificados'],
  queryFn: () => getItemsUnificadosAction(),
  staleTime: 1000 * 60, // 1 minutes
  refetchOnMount: true, // refetch si está stale al montar
  refetchOnWindowFocus: true, // refetch al volver a la pestaña
  refetchOnReconnect: true, // refetch al recuperar red
})

const { data: carpetas, isLoading: isLoadingCarpeta } = useCarpetas()

const itemClass = (item: ItemUnificado) => {
  return item.tipo === 'banco' ? ' bg-primary/10' : 'bg-warning/10'
}
const isMobile = useMediaQuery('(max-width: 768px)')

const columnas: DataTableColumns<ItemUnificado> = [
  {
    id: 'tipo',
    accessorFn: (item) => item.tipo,
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
    accessorFn: (item) =>
      (item.tipo === 'banco' ? item.cantidadReactivos : item.cantidadBancos) ?? 0,
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
  {
    id: 'compartido',
    accessorFn: (item) => item.cantidadCompartidos ?? 0,
    header: 'Compartido',
    meta: { thClass: 'w-40 text-center', tdClass: 'text-center align-middle' },
  },
  {
    id: 'acciones',
    header: 'Acciones',
    meta: { thClass: 'w-32 text-center', tdClass: 'text-center align-middle overflow-visible' },
  },
]

function abrirModalCarpeta(carpeta?: ItemUnificado) {
  closeDropdown()
  modal.openModal(CrearCarpeta, { carpeta: carpeta?.original }, [
    { label: 'Cerrar', variant: 'outline' },
    { label: 'Guardar', variant: 'primary', type: 'submit' },
  ])
}

function EliminarCarpeta(carpeta: ItemUnificado) {
  closeDropdown()
  modal.openModal(eliminarCarpeta, { carpeta: carpeta.original }, [
    { label: 'Cerrar', variant: 'outline' },
    { label: 'Eliminar', variant: 'error', type: 'submit' },
  ])
}
function abrirModalBanco(banco?: ItemUnificado) {
  closeDropdown()
  modal.openModal(NuevoBanco, { banco: banco?.original }, [
    { label: 'Cerrar', variant: 'outline' },
    { label: 'Guardar', variant: 'primary', type: 'submit' },
  ])
}

function EliminarBanco(Banco: ItemUnificado) {
  closeDropdown()
  modal.openModal(eliminarBanco, { banco: Banco.original }, [
    { label: 'Cerrar', variant: 'outline' },
    { label: 'Eliminar', variant: 'error', type: 'submit' },
  ])
}

function Compartirbanco(Banco: ItemUnificado) {
  closeDropdown()
  modal.openModal(
    CompartirBanco,
    { banco: Banco.original },
    [
      { label: 'Cerrar', variant: 'outline' },
      { label: 'Compartir', variant: 'primary', type: 'submit' },
    ],
    'max-w-5xl',
  )
}

function closeDropdown() {
  ;(document.activeElement as HTMLElement)?.blur()
}

const router = useRouter()

const irADetalle = (item: ItemUnificado) => {
  router.push({
    name: item.tipo === 'carpeta' ? 'carpetaDetalle' : 'bancoDetalle',
    params: {
      id: item.id,
    },
  })
}

const busquedaCarpeta = ref('')

const carpetasFiltradas = computed(() => {
  if (!carpetas.value) return []

  return carpetas.value.filter((carpeta) =>
    carpeta.nombre.toLowerCase().includes(busquedaCarpeta.value.toLowerCase()),
  )
})
const queryClient = useQueryClient()
const moverBanco = async (carpetaId: string, bancoId: string) => {
  try {
    const rep = await moveBancoCarpeta(carpetaId, bancoId)
    if (rep.bancoAgregado === true) {
      toast.success('Banco movido correctamente')
      await queryClient.invalidateQueries({
        queryKey: ['items-unificados'],
      })
    }
  } catch {
    toast.error('Ocurrio algo inesperado')
  }
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4">
    <!-- HEADER -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
      <div class="">
        <h1 class="text-2xl font-bold">Gestión de Bancos</h1>

        <p class="text-sm text-base-content/70">Administra carpetas y bancos de reactivos</p>
      </div>

      <div v-if="data?.length" class="flex items-center gap-2">
        <button class="btn bg-base-100" @click="abrirModalCarpeta()">
          <i class="fa-regular fa-folder text-warning"></i>
          Nueva Carpeta
        </button>
        <button class="btn btn-primary" @click="abrirModalBanco()">
          <i class="fa-regular fa-file-lines"></i>
          Nuevo Banco
        </button>
      </div>
    </div>

    <!-- TABLA -->
    <DataTable
      v-if="!isMobile"
      container-class="app-card border border-base-300 bg-base-100 overflow-visible"
      :data="data"
      :columns="columnas"
      :is-loading="isLoading"
      @row-click="irADetalle"
    >
      <template #cell-tipo="{ row }">
        <div
          class="w-10 h-10 rounded-xl flex items-center justify-center mx-auto"
          :class="itemClass(row)"
        >
          <i
            :class="{
              'fa-regular fa-folder text-warning text-lg': row.tipo === 'carpeta',

              'fa-regular fa-file-lines text-primary text-lg': row.tipo === 'banco',
            }"
          ></i>
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
            <span v-if="row.tipo === 'banco'" class="w-12 text-right font-mono">
              {{ row.cantidadReactivos || 0 }}
            </span>
            <span v-if="row.tipo === 'carpeta'" class="w-12 text-right font-mono">
              {{ row.cantidadBancos || 0 }}
            </span>

            <span class="ml-2 text-left">
              {{ row.tipo === 'banco' ? 'reactivos' : 'bancos' }}
            </span>
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

      <template #cell-compartido="{ row }">
        <div class="flex justify-center">
          <div v-if="row.tipo === 'banco'" class="inline-flex items-center text-success min-w-30">
            <span class="w-5 text-center">
              <i class="fa-light fa-user-group"></i>
            </span>

            <span class="ml-2">
              {{ row.cantidadCompartidos }}
              {{ row.cantidadCompartidos === 1 ? 'usuario' : 'usuarios' }}
            </span>
          </div>

          <div v-else class="inline-flex items-center min-w-30">
            <span class="w-5 text-center">
              <i class="fa-regular fa-minus"></i>
            </span>
          </div>
        </div>
      </template>

      <template #cell-acciones="{ row }">
        <div class="dropdown dropdown-left" @click.stop>
          <div
            tabindex="0"
            role="button"
            class="btn btn-ghost btn-sm btn-circle"
            @click.stop
          >
            <i class="fa-regular fa-ellipsis-vertical"></i>
          </div>

          <ul
            tabindex="0"
            class="dropdown-content menu bg-base-100 rounded-2xl w-52 p-2 shadow-xl border border-base-300"
          >
            <li v-if="row.tipo === 'carpeta'">
              <a @click.stop="abrirModalCarpeta(row)">
                <i class="fa-regular fa-pen-to-square"></i>
                Editar
              </a>
            </li>
            <li v-if="row.tipo === 'banco'">
              <a @click.stop="abrirModalBanco(row)">
                <i class="fa-regular fa-pen-to-square"></i>
                Editar
              </a>
            </li>
            <li v-if="row.tipo !== 'carpeta'">
              <a @click.stop="Compartirbanco(row)">
                <i class="fa-regular fa-share"></i>
                Compartir
              </a>
            </li>

            <li v-if="row.tipo !== 'carpeta'">
              <div class="dropdown">
                <div tabindex="0" role="button" class="m-1">
                  <i class="fa-regular fa-folder"></i>
                  Mover a carpeta
                </div>
                <ul
                  tabindex="-1"
                  class="menu dropdown-content bg-base-100 rounded-box z-1 w-72 p-2 shadow-xl border border-base-300"
                >
                  <li class="sticky top-0 bg-base-100 z-10 p-2">
                    <input
                      v-model="busquedaCarpeta"
                      type="text"
                      placeholder="Buscar carpeta..."
                      class="input input-sm input-bordered w-full"
                    />
                  </li>
                  <li v-if="isLoadingCarpeta">
                    <div>Cargando carpetas...</div>
                  </li>
                  <li
                    v-else-if="carpetasFiltradas.length === 0"
                    class="text-center text-base-content/60 py-2"
                  >
                    No se encontraron carpetas
                  </li>
                  <li v-for="carpeta in carpetasFiltradas" :key="carpeta.idCarpeta">
                    <a
                      @click="moverBanco(carpeta.idCarpeta, row.id)"
                      class="flex items-center justify-between"
                    >
                      <span class="truncate max-w-45" :title="carpeta.nombre">
                        {{
                          carpeta.nombre.length > 30
                            ? carpeta.nombre.slice(0, 30) + '...'
                            : carpeta.nombre
                        }}
                      </span>
                      <i class="fa-regular fa-folder text-warning"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </li>

            <div class="divider my-1"></div>

            <li v-if="row.tipo === 'carpeta'">
              <a @click.stop="EliminarCarpeta(row)" class="text-error">
                <i class="fa-regular fa-trash"></i>
                Eliminar
              </a>
            </li>

            <li v-if="row.tipo === 'banco'">
              <a @click.stop="EliminarBanco(row)" class="text-error">
                <i class="fa-regular fa-trash"></i>
                Eliminar banco
              </a>
            </li>
          </ul>
        </div>
      </template>

      <template #empty>
        <div class="flex flex-col items-center py-16">
          <div
            class="w-20 h-20 rounded-full bg-base-200 flex items-center justify-center mb-4"
          >
            <i class="fa-regular fa-folder-open text-4xl text-base-content/40"></i>
          </div>

          <h2 class="text-lg font-bold">No hay elementos</h2>

          <p class="text-sm text-base-content/60 mt-1">
            Puedes crear una carpeta o banco para comenzar
          </p>

          <div class="flex items-center gap-2 mt-5">
            <button class="btn bg-white" @click="abrirModalCarpeta()">
              <i class="fa-regular fa-folder text-warning"> </i>
              Nueva Carpeta
            </button>
            <button class="btn btn-primary" @click="abrirModalBanco()">
              <i class="fa-regular fa-file-lines"></i>
              Nuevo Banco
            </button>
          </div>
        </div>
      </template>
    </DataTable>

    <!-- esto es para movil -->
    <div v-else class="grid grid-cols-1 gap-4">
      <div v-for="item in data" :key="item.id" class="card bg-base-100 shadow-md border">
        <div class="card-body p-4">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <i class="fa-regular fa-file-lines text-primary"></i>
            </div>
            <div class="font-bold truncate">{{ item.nombre }}</div>
          </div>
          <p v-if="item.descripcion" class="text-sm text-base-content/60">
            {{ item.descripcion }}
          </p>
          <div class="flex justify-between mt-3 text-sm">
            <span class="badge badge-ghost">{{ item.compartido ? 'Compartido' : 'Privado' }}</span>
            <span class="text-xs">{{ new Date(item.fechaModificacion).toLocaleDateString() }}</span>
          </div>
          <div class="card-actions justify-end mt-2">
            <button class="btn btn-xs btn-ghost">Acciones</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
