<template>
  <div class="max-w-7xl mx-autopx-4">
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

      <div class="rounded-2xl border border-base-300 bg-base-100 shadow-sm overflow-visible">
        <div class="overflow-visible">
          <div v-if="isLoading" class="p-6 space-y-3">
            <div class="skeleton h-14 w-full"></div>
            <div class="skeleton h-16 w-full"></div>
            <div class="skeleton h-16 w-full"></div>
            <div class="skeleton h-16 w-full"></div>
          </div>

          <div v-else class="table table-fixed w-full block overflow-x-auto whitespace-nowrap">
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
            <tbody v-if="BancosCarpeta?.length">
              <!-- <pre>{{ data }}</pre> -->
              <tr
                v-for="value in BancosCarpeta"
                :key="value.bancoId"
                class="hover transition-colors cursor-pointer"
              >
                <!-- ICON -->
                <td class="text-center align-middle">
                  <div
                    class="w-10 h-10 rounded-xl flex items-center justify-center mx-auto bg-primary/10"
                  >
                    <i class="fa-regular fa-file-lines text-primary text-lg"></i>
                  </div>
                </td>
                <!-- Nombre y descripcion -->
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
                      <span class="w-12 text-right font-mono">
                        {{ value.cantidadReactivos || 0 }}
                      </span>

                      <span class="ml-2 text-left"> reactivos </span>
                    </div>
                  </div>
                </td>
                <!-- Ultima Modificacion -->
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
                    <div class="inline-flex items-center text-success min-w-30">
                      <span class="w-5 text-center">
                        <i class="fa-light fa-user-group"></i>
                      </span>

                      <span class="ml-2">
                        {{ value.cantidadCompartidos }}
                        {{ value.bancoId === 1 ? 'usuario' : 'usuarios' }}
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
                      <li>
                        <a @click.stop="abrirModalBanco(value, carpetaIdNumber)">
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
                        <a>
                          <i class="fa-regular fa-copy"></i>
                          Copiar
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
                                :class="{
                                  'pointer-events-none opacity-50 ':
                                    carpetax?.carpetaId === carpeta.carpetaId,
                                }"
                                @click="
                                  moverCarpetaACarpeta(
                                    carpetax?.carpetaId!,
                                    value.bancoId,
                                    carpeta.carpetaId,
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
                                  v-if="carpetax?.carpetaId === carpeta.carpetaId"
                                  class="fa-solid fa-check text-success"
                                ></i>
                                <i v-else class="fa-regular fa-folder text-warning"></i>
                              </a>
                            </li>
                            <li>
                              <a class="flex items-center justify-between"> Sin carpeta </a>
                            </li>
                          </ul>
                        </div>
                      </li>

                      <div class="divider my-1"></div>

                      <li>
                        <a @click="Eliminar(value, carpetaIdNumber)" class="text-error">
                          <i class="fa-regular fa-trash"></i>
                          Eliminar banco
                        </a>
                      </li>
                    </ul>
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
                      <i class="fa-regular fa-file-lines text-4xl text-base-content/40"></i>
                    </div>

                    <h2 class="text-lg font-bold">No hay elementos</h2>

                    <p class="text-sm text-base-content/60 mt-1">
                      Puedes crear un banco para comenzar
                    </p>

                    <div class="flex items-center gap-2 mt-5">
                      <button
                        class="btn btn-primary"
                        @click="abrirModalBanco(undefined, carpetaIdNumber)"
                      >
                        <i class="fa-regular fa-file-lines"></i>
                        Nuevo Banco
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { getBancoCarpetaAction } from '@/api/bancos/actions'
import type { Banco } from '@/api/bancos/interfaces/banco.interface'
import NuevoBanco from '@/app/common/components/modals/nuevoBanco.vue'
import { useModalStore } from '@/common/modals/store/modal.store'
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { useRoute } from 'vue-router'

import eliminarBanco from '@/app/common/components/modals/eliminarBanco.vue'
import { getCarpetaById } from '@/api/carpetas/actions/getById-carpeta.action'
import { computed, ref } from 'vue'
import { useCarpetas } from '@/api/carpetas/composable/useCarpetas'
import { moveCarpetaCarpeta } from '@/api/carpetas/actions/move-carpeta-carpeta.action'
import { toast } from 'vue-sonner'

const modal = useModalStore()
const route = useRoute()

const carpetaIdNumber = Number(route.params.id)
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
function abrirModalBanco(banco?: Banco, carpetaId?: number) {
  console.warn('este es el id', banco?.bancoId)
  modal.openModal(NuevoBanco, { carpetaId, banco }, [
    { label: 'Cerrar', variant: 'outline' },
    { label: 'Guardar', variant: 'primary', type: 'submit' },
  ])
}

function Eliminar(Banco: Banco, carpetaId?: number) {
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

const moverCarpetaACarpeta = async (carpetaId: number, bancoId: number, destino: number) => {
  // const carpetaOrigen = carpetaId.toString()
  const banco = bancoId.toString()
  const DestinoC = destino.toString()

  const origen = carpetaId.toString()
  // console.warn(carpetaOrigen, banco)
  // console.warn(typeof carpetaOrigen, typeof banco)
  try {
    const rep = await moveCarpetaCarpeta(origen, banco, DestinoC)
    if (rep.bancoMovido === true) {
      closeDropdown()
      toast.success('Banco movido correctamente')
      await queryClient.invalidateQueries({
        queryKey: ['bancos-carpeta', carpetaIdNumber],
      })
    }
  } catch (error) {
    toast.error('Algo salio mal')
  }
}

const busquedaCarpeta = ref('')

const carpetasFiltradas = computed(() => {
  console.warn(carpetax.value?.carpetaId)
  if (!carpetas.value) return []

  return carpetas.value.filter((carpeta) =>
    carpeta.nombre.toLowerCase().includes(busquedaCarpeta.value.toLowerCase()),
  )
})
</script>
