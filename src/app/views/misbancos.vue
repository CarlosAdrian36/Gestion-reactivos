<script lang="ts" setup>
import { useMediaQuery } from '@vueuse/core'
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { useRouter } from 'vue-router'

import { getItemsUnificadosAction } from '@/app/unifiacados/actions/get-items-unificados.actions'
import { getCarpetasAction } from '@/api/carpetas/actions/get-carpetas.actions.ts'

import CrearCarpeta from '../common/components/modals/crearCarpeta.vue'
import eliminarCarpeta from '../common/components/modals/eliminarCarpeta.vue'
import NuevoBanco from '../common/components/modals/nuevoBanco.vue'
import eliminarBanco from '../common/components/modals/eliminarBanco.vue'

import { useModalStore } from '@/common/modals/store/modal.store'
import type { ItemUnificado } from '../unifiacados/interface/item-unificado.interface'
const modal = useModalStore()

const { data, isLoading, error, isError } = useQuery({
  queryKey: ['items-unificados'],
  queryFn: () => getItemsUnificadosAction(),
  staleTime: 1000 * 60, // 1 minutes
  refetchOnMount: true, // refetch si está stale al montar
  refetchOnWindowFocus: true, // refetch al volver a la pestaña
  refetchOnReconnect: true, // refetch al recuperar red
})

const { data: carpetas, isLoading: isLoadingCarpeta } = useQuery({
  queryKey: ['carpetas'],
  queryFn: () => getCarpetasAction(),
  staleTime: 1000 * 60,
  refetchOnMount: true,
  refetchOnWindowFocus: true,
  refetchOnReconnect: true,
})

const itemClass = (item: ItemUnificado) => {
  return item.tipo === 'banco' ? ' bg-primary/10' : 'bg-warning/10'
}
const isMobile = useMediaQuery('(max-width: 768px)')

function abrirModalCarpeta(carpeta?: ItemUnificado) {
  closeDropdown()
  console.warn(carpeta?.id)
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

import { computed, ref } from 'vue'
import { moveBancoCarpeta } from '@/api/carpetas/actions/move-riaz-carpeta.action.ts'
import { toast } from 'vue-sonner'

const busquedaCarpeta = ref('')

const carpetasFiltradas = computed(() => {
  if (!carpetas.value) return []

  return carpetas.value.filter((carpeta) =>
    carpeta.nombre.toLowerCase().includes(busquedaCarpeta.value.toLowerCase()),
  )
})
const queryClient = useQueryClient()
const moverBanco = async (carpetaId: number, bancoId: number) => {
  try {
    const rep = await moveBancoCarpeta(carpetaId, bancoId)
    if (rep.bancoAgregado === true) {
      toast.success('Banco movido correctamente')
      await queryClient.invalidateQueries({
        queryKey: ['items-unificados'],
      })
    }
  } catch (error) {
    toast.error('Ocurrio algo inesperado')
  }
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4">
    <!-- HEADER -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
      <div>
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
    <div
      v-if="!isMobile"
      class="rounded-2xl border border-base-300 bg-base-100 shadow-sm overflow-visible"
    >
      <!-- LOADING -->
      <div class="overflow-visible">
        <div v-if="isLoading" class="p-6 space-y-3">
          <div class="skeleton h-14 w-full"></div>
          <div class="skeleton h-16 w-full"></div>
          <div class="skeleton h-16 w-full"></div>
          <div class="skeleton h-16 w-full"></div>
        </div>

        <!-- TABLE -->
        <table v-else class="table table-fixed w-full block overflow-x-auto whitespace-nowrap">
          <!-- HEAD -->
          <thead class="bg-base-200">
            <tr>
              <th class="w-16 text-center">Tipo</th>

              <th class="min-w-62.5">Nombre</th>

              <th class="w-40 text-center">Contenido</th>

              <th class="w-52 text-center">Última modificación</th>

              <th class="w-40 text-center">Compartido</th>

              <th class="w-32 text-center">Acciones</th>
            </tr>
          </thead>

          <!-- BODY -->
          <tbody v-if="data && data.length > 0">
            <tr
              v-for="value in data"
              :key="value.id"
              class="hover transition-colors cursor-pointer"
              @click="irADetalle(value)"
            >
              <!-- ICON -->
              <td class="text-center align-middle">
                <div
                  class="w-10 h-10 rounded-xl flex items-center justify-center mx-auto"
                  :class="itemClass(value)"
                >
                  <i
                    :class="{
                      'fa-regular fa-folder text-warning text-lg': value.tipo === 'carpeta',

                      'fa-regular fa-file-lines text-primary text-lg': value.tipo === 'banco',
                    }"
                  ></i>
                </div>
              </td>

              <!-- Nombre y descripción -->
              <td class="align-middle">
                <div class="min-w-0">
                  <div class="flex items-center gap-2">
                    <p class="font-semibold truncate" :title="value.nombre">
                      {{ value.nombre }}
                    </p>
                  </div>

                  <p
                    v-if="value.descripcion"
                    class="text-sm text-base-content/60 truncate mt-1"
                    :title="value.descripcion"
                  >
                    {{ value.descripcion }}
                  </p>
                </div>
              </td>
              <!-- Contenido -->
              <td class="text-center align-middle">
                <div class="flex justify-center text-base-content/60">
                  <div class="inline-flex items-center min-w-30">
                    <span v-if="value.tipo === 'banco'" class="w-12 text-right font-mono">
                      {{ value.cantidadReactivos || 0 }}
                    </span>
                    <span v-if="value.tipo === 'carpeta'" class="w-12 text-right font-mono">
                      {{ value.cantidadBancos || 0 }}
                    </span>

                    <span class="ml-2 text-left">
                      {{ value.tipo === 'banco' ? 'reactivos' : 'bancos' }}
                    </span>
                  </div>
                </div>
              </td>
              <!-- Última modificación -->
              <td class="text-center align-middle">
                <div class="flex flex-col">
                  <span class="font-medium text-sm">
                    {{
                      new Date(value.fechaModificacion).toLocaleDateString('es-ES', {
                        dateStyle: 'medium',
                      })
                    }}
                  </span>
                </div>
                <span class="text-sm text-base-content/60">
                  {{
                    new Date(value.fechaModificacion).toLocaleTimeString('es-ES', {
                      timeStyle: 'short',
                    })
                  }}
                </span>
              </td>
              <!-- Compartido -->

              <td class="text-center align-middle">
                <div class="flex justify-center">
                  <div
                    v-if="value.tipo === 'banco'"
                    class="inline-flex items-center text-success min-w-30"
                  >
                    <span class="w-5 text-center">
                      <i class="fa-light fa-user-group"></i>
                    </span>

                    <span class="ml-2">
                      {{ value.cantidadCompartidos }}
                      {{ value.id === 1 ? 'usuario' : 'usuarios' }}
                    </span>
                  </div>

                  <div v-else class="inline-flex items-center min-w-30">
                    <span class="w-5 text-center">
                      <i class="fa-regular fa-minus"></i>
                    </span>
                  </div>
                </div>
              </td>

              <!-- Acciones -->
              <td class="text-center align-middle overflow-visible">
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
                    <li v-if="value.tipo === 'carpeta'">
                      <a @click.stop="abrirModalCarpeta(value)">
                        <i class="fa-regular fa-pen-to-square"></i>
                        Editar
                      </a>
                    </li>
                    <li v-if="value.tipo === 'banco'">
                      <a @click.stop="abrirModalBanco(value)">
                        <i class="fa-regular fa-pen-to-square"></i>
                        Editar
                      </a>
                    </li>
                    <li v-if="value.tipo !== 'carpeta'">
                      <a>
                        <i class="fa-regular fa-share"></i>
                        Compartir
                      </a>
                    </li>

                    <li>
                      <a>
                        <i class="fa-regular fa-copy"></i>
                        Copiar
                      </a>
                    </li>
                    <li v-if="value.tipo !== 'carpeta'">
                      <div class="dropdown">
                        <div tabindex="0" role="button" class="m-1">
                          <i class="fa-regular fa-folder"></i>
                          Mover a
                        </div>

                        <ul
                          tabindex="-1"
                          class="menu dropdown-content bg-base-100 rounded-box z-1 w-72 p-2 shadow-xl border border-base-300"
                        >
                          <!-- BUSCADOR -->
                          <li class="sticky top-0 bg-base-100 z-10 p-2">
                            <input
                              v-model="busquedaCarpeta"
                              type="text"
                              placeholder="Buscar carpeta..."
                              class="input input-sm input-bordered w-full"
                            />
                          </li>

                          <!-- LOADING -->
                          <li v-if="isLoadingCarpeta">
                            <div>Cargando carpetas...</div>
                          </li>

                          <!-- SIN RESULTADOS -->
                          <li
                            v-else-if="carpetasFiltradas.length === 0"
                            class="text-center text-base-content/60 py-2"
                          >
                            No se encontraron carpetas
                          </li>

                          <!-- RESULTADOS -->
                          <li v-for="carpeta in carpetasFiltradas" :key="carpeta.carpetaId">
                            <a
                              @click="moverBanco(carpeta.carpetaId, value.id)"
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

                    <li v-if="value.tipo === 'carpeta'">
                      <a @click="EliminarCarpeta(value)" class="text-error">
                        <i class="fa-regular fa-trash"></i>
                        Eliminar
                      </a>
                    </li>

                    <li v-if="value.tipo === 'banco'">
                      <a @click="EliminarBanco(value)" class="text-error">
                        <i class="fa-regular fa-trash"></i>
                        Eliminar banco
                      </a>
                    </li>
                  </ul>
                </div>
              </td>
            </tr>
          </tbody>

          <!-- EMPTY -->
          <tbody v-else>
            <tr>
              <td colspan="5">
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

                  <div v-if="!data?.length" class="flex items-center gap-2 mt-5">
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
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
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
          <p v-if="item.descripcion" class="text-sm text-base-content/60">{{ item.descripcion }}</p>
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
