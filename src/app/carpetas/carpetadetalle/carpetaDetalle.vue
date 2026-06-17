<template>
  <div class="max-w-7xl mx-autopx-4">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
      <div>
        <h1 class="text-2xl font-bold">Carpeta: {{ carpetaIdNumber }}</h1>

        <p class="text-sm text-base-content/70">
          Administra bancos de reactivos dentro de una carpeta
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button class="btn btn-primary" @click="abrirModalBanco()">
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
          <tbody v-if="data?.length">
            <!-- <pre>{{ data }}</pre> -->
            <tr
              v-for="value in data"
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
                      <a @click.stop="">
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
                          <!-- <i class="fa-regular fa-angle-down"></i> -->
                        </div>
                        <ul
                          tabindex="-1"
                          class="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
                        >
                          <li><a>Item 1</a></li>
                          <li><a>Item 2</a></li>
                          <li><a>Item 1</a></li>
                          <li><a>Item 1</a></li>
                          <li><a>Item 2</a></li>
                          <li><a>Item 1</a></li>
                          <li><a>Item 1</a></li>
                          <li><a>Item 2</a></li>
                          <li><a>Item 1</a></li>
                          <li><a>Item 1</a></li>
                          <li><a>Item 2</a></li>
                          <li><a>Item 1</a></li>
                          <li><a>Item 1</a></li>
                          <li><a>Item 2</a></li>
                          <li><a>Item 1</a></li>
                        </ul>
                      </div>
                    </li>

                    <div class="divider my-1"></div>

                    <li>
                      <a @click="" class="text-error">
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
                    <button class="btn btn-primary" @click="abrirModalBanco(carpetaIdNumber)">
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
</template>
<script lang="ts" setup>
import { getBancoCarpetaAction } from '@/api/bancos/actions'
import type { Banco } from '@/api/bancos/interfaces/banco.interface'
import NuevoBanco from '@/app/common/components/modals/nuevoBanco.vue'
import { useModalStore } from '@/common/modals/store/modal.store'
import { useQuery } from '@tanstack/vue-query'
import { useRoute } from 'vue-router'

const modal = useModalStore()
const route = useRoute()

// const carpetaId = computed(() => Number(route.params.id))
const carpetaIdNumber = Number(route.params.id)
const { data, isLoading } = useQuery({
  queryKey: ['bancos-carpeta', carpetaIdNumber],
  queryFn: () => getBancoCarpetaAction(carpetaIdNumber),
})

function abrirModalBanco(carpetaId?: number, banco?: Banco) {
  console.warn(carpetaId)
  modal.openModal(NuevoBanco, { carpetaId, banco }, [
    { label: 'Cerrar', variant: 'outline' },
    { label: 'Guardar', variant: 'primary', type: 'submit' },
  ])
}
</script>
