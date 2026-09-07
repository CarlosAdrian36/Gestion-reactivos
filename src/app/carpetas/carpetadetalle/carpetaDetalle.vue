<template>
  <div class="max-w-7xl mx-auto px-4">
    <div v-if="isLoading">
      <div class="skeleton h-8 w-64 mb-4"></div>
      <div class="skeleton h-14 w-full"></div>
      <div class="skeleton h-16 w-full mt-2"></div>
      <div class="skeleton h-16 w-full mt-2"></div>
    </div>
    <div v-else>
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
        <div class="flex flex-row gap-3.5">
          <i class="fa-regular fa-folder text-warning text-5xl"></i>
          <div v-if="isLoadingInformacionCarpeta">
            <div class="skeleton h-8 w-56"></div>
            <div class="skeleton h-4 w-80 mt-2"></div>
          </div>
          <div v-else>
            <h1 class="text-2xl font-bold">Carpeta: {{ carpetax?.nombre }}</h1>
            <p class="text-sm text-base-content/70">
              Administra bancos de reactivos dentro de una carpeta
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button class="btn btn-primary" @click="abrirModalBanco(undefined, carpetaIdNumber)">
            <i class="fa-regular fa-file-lines"></i>
            Nuevo Banco
          </button>
        </div>
      </div>

      <DataTable :data="BancosCarpeta" :columns="columnas" @row-click="irADetalle">
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

        <template #cell-compartido="{ row }">
          <div class="flex justify-center">
            <div class="inline-flex items-center text-success min-w-30">
              <span class="w-5 text-center">
                <i class="fa-light fa-user-group"></i>
              </span>

              <span class="ml-2">
                {{ row.cantidadCompartidos }}
                {{ row.cantidadCompartidos === 1 ? 'usuario' : 'usuarios' }}
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
              <li>
                <a @click.stop="abrirModalBanco(row, carpetaIdNumber)">
                  <i class="fa-regular fa-pen-to-square"></i>
                  Editar
                </a>
              </li>
              <li>
                <a>
                  <i class="fa-regular fa-share"></i>
                  Compartir
                </a>
              </li>

              <li>
                <div class="dropdown">
                  <div tabindex="0" role="button" class="m-1">
                    <i class="fa-regular fa-folder"></i>
                    Mover a
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
                        :class="{
                          'pointer-events-none opacity-50 ':
                            carpetax?.idCarpeta === carpeta.idCarpeta,
                        }"
                        @click="
                          moverCarpetaACarpeta(
                            carpetax?.idCarpeta!,
                            row.idBanco,
                            carpeta.idCarpeta,
                          )
                        "
                        class="flex items-center justify-between"
                      >
                        <span class="truncate max-w-45" :title="carpeta.nombre">
                          {{
                            carpeta.nombre.length > 30
                              ? carpeta.nombre.slice(0, 30) + '...'
                              : carpeta.nombre
                          }}
                        </span>
                        <i
                          v-if="carpetax?.idCarpeta === carpeta.idCarpeta"
                          class="fa-solid fa-check text-success"
                        ></i>
                        <i v-else class="fa-regular fa-folder text-warning"></i>
                      </a>
                    </li>
                    <div class="divider"></div>
                    <li>
                      <a
                        @click="moveRaiz(carpetax?.idCarpeta!, row.idBanco)"
                        class="flex items-center justify-between"
                      >
                        Sin carpeta

                        <i class="fa-regular fa-folder-minus"></i>
                      </a>
                    </li>
                  </ul>
                </div>
              </li>

              <div class="divider"></div>

              <li>
                <a @click.stop="Eliminar(row, carpetaIdNumber)" class="text-error">
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
              <i class="fa-regular fa-file-lines text-4xl text-base-content/40"></i>
            </div>

            <h2 class="text-lg font-bold">No hay elementos</h2>

            <p class="text-sm text-base-content/60 mt-1">
              Puedes crear un banco para comenzar
            </p>

            <div class="flex items-center gap-2 mt-5">
              <button class="btn btn-primary" @click="abrirModalBanco(undefined, carpetaIdNumber)">
                <i class="fa-regular fa-file-lines"></i>
                Nuevo Banco
              </button>
            </div>
          </div>
        </template>
      </DataTable>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { getBancoCarpetaAction } from '@/api/bancos/actions'
import type { Banco } from '@/api/bancos/interfaces/banco.interface'
import NuevoBanco from '@/app/common/components/modals/nuevoBanco.vue'
import { useModalStore } from '@/common/modals/store/modal.store'
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { useRoute, useRouter } from 'vue-router'

import eliminarBanco from '@/app/common/components/modals/eliminarBanco.vue'
import { getCarpetaById } from '@/api/carpetas/actions/getById-carpeta.action'
import { computed, ref } from 'vue'
import { useCarpetas } from '@/api/carpetas/composable/useCarpetas'
import { moveCarpetaCarpeta } from '@/api/carpetas/actions/move-carpeta-carpeta.action'
import { toast } from 'vue-sonner'
import { moveCarpetaRaiz } from '@/api/carpetas/actions/move-carpeta-raiz.action'
import DataTable from '@/app/common/components/table/DataTable.vue'
import type { DataTableColumns } from '@/app/common/components/table/features'

const modal = useModalStore()
const route = useRoute()
const router = useRouter()

const carpetaIdNumber = route.params.id as string
const { data: BancosCarpeta, isLoading: isLoadingBancosCarpetas } = useQuery({
  queryKey: ['bancos-carpeta', carpetaIdNumber],
  queryFn: () => getBancoCarpetaAction(carpetaIdNumber),
  staleTime: 1000 * 60, // 1 minutes
  refetchOnMount: true, // refetch si está stale al montar
  refetchOnWindowFocus: true, // refetch al volver a la pestaña
  refetchOnReconnect: true, // refetch al recuperar red
})

const { data: carpetax, isLoading: isLoadingInformacionCarpeta } = useQuery({
  queryKey: ['informacionCarpeta', carpetaIdNumber],
  queryFn: () => getCarpetaById(carpetaIdNumber),
  select: (res) => res.carpeta,
  staleTime: 1000 * 60, // 1 minutes
  refetchOnMount: true, // refetch si está stale al montar
  refetchOnWindowFocus: true, // refetch al volver a la pestaña
  refetchOnReconnect: true, // refetch al recuperar red
})
const isLoading = computed(() => {
  return isLoadingBancosCarpetas.value || isLoadingInformacionCarpeta.value
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
  {
    id: 'compartido',
    accessorFn: (banco) => banco.cantidadCompartidos,
    header: 'Compartido',
    meta: { thClass: 'w-40 text-center', tdClass: 'text-center align-middle' },
  },
  {
    id: 'acciones',
    header: 'Acciones',
    meta: { thClass: 'w-32 text-center', tdClass: 'text-center align-middle overflow-visible' },
  },
]

function irADetalle(banco: Banco) {
  router.push({ name: 'bancoDetalle', params: { id: banco.idBanco } })
}
function abrirModalBanco(banco?: Banco, carpetaId?: string) {
  closeDropdown()
  console.warn('este es el id', banco?.idBanco)
  modal.openModal(NuevoBanco, { carpetaId, banco }, [
    { label: 'Cerrar', variant: 'outline' },
    { label: 'Guardar', variant: 'primary', type: 'submit' },
  ])
}

function Eliminar(Banco: Banco, carpetaId?: string) {
  closeDropdown()
  modal.openModal(eliminarBanco, { banco: Banco, carpetaId }, [
    { label: 'Cerrar', variant: 'outline' },
    { label: 'Eliminar', variant: 'error', type: 'submit' },
  ])
}
function closeDropdown() {
  ;(document.activeElement as HTMLElement)?.blur()
}

const { data: carpetas, isLoading: isLoadingCarpeta } = useCarpetas()
const queryClient = useQueryClient()
const moveRaiz = async (C: string, B: string) => {
  const carpetaOrigen = C.toString()
  const BancoMove = B.toString()
  try {
    const rep = await moveCarpetaRaiz(carpetaOrigen, BancoMove)
    if (rep.bancoQuitado === true) {
      closeDropdown()
      toast.success('Banco movido correctamente')
      await queryClient.invalidateQueries({
        queryKey: ['bancos-carpeta', carpetaIdNumber],
      })
      await queryClient.invalidateQueries({
        queryKey: ['items-unificados'],
      })
    }
  } catch {
    toast.error('Algo salio mal')
  }
}

const moverCarpetaACarpeta = async (carpetaId: string, bancoId: string, destino: string) => {
  const banco = bancoId.toString()
  const DestinoC = destino.toString()

  const origen = carpetaId.toString()
  try {
    const rep = await moveCarpetaCarpeta(origen, banco, DestinoC)
    if (rep.bancoMovido === true) {
      closeDropdown()
      toast.success('Banco movido correctamente')
      await queryClient.invalidateQueries({
        queryKey: ['bancos-carpeta', carpetaIdNumber],
      })
      await queryClient.invalidateQueries({
        queryKey: ['items-unificados'],
      })
    }
  } catch {
    toast.error('Algo salio mal')
  }
}

const busquedaCarpeta = ref('')

const carpetasFiltradas = computed(() => {
  if (!carpetas.value) return []

  return carpetas.value.filter((carpeta) =>
    carpeta.nombre.toLowerCase().includes(busquedaCarpeta.value.toLowerCase()),
  )
})
</script>
