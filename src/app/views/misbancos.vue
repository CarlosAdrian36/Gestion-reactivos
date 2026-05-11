<script lang="ts" setup>
import { computed, onMounted } from 'vue'
import { useBancoStore } from '../store/bancos.store'
import { useFolderStore } from '../store/folders.store'
import { storeToRefs } from 'pinia'
import type { Carpeta } from '../interface/carpetoInterface'

const bancoStore = useBancoStore()
const carpetaStore = useFolderStore()

onMounted(async () => {
  await Promise.all([bancoStore.fetchBancos(), carpetaStore.fetchFolders()])
})

const { bancos, loading: bancosLoading } = storeToRefs(bancoStore)

const { folders, loading: carpetasLoading } = storeToRefs(carpetaStore)

type ExplorerItem =
  | {
      tipo: 'carpeta'
      id: number
      nombre: string
      fechaModificacion: string
      fechaCreacion?: string
      bancos: number
    }
  | {
      tipo: 'banco'
      id: number
      nombre: string
      descripcion: string
      fechaModificacion: string
      fechaCreacion?: string
      reactivos: number
      estatus?: string
      esCompartido: boolean
      esProyecto: boolean
      carpetaId: number | null
    }

const items = computed<ExplorerItem[]>(() => [
  ...folders.value.map((carpeta: Carpeta) => ({
    ...carpeta,
    tipo: 'carpeta' as const,
  })),

  ...bancos.value.map((banco) => ({
    ...banco,
    tipo: 'banco' as const,
  })),
])

const loading = computed(() => bancosLoading.value || carpetasLoading.value)
</script>

<!-- <template>
  <div class="max-w-350 mx-auto px-6 py-6">
    <div v-if="loading" class="space-y-2">
      <div class="skeleton h-16 w-full"></div>
      <div class="skeleton h-90 w-full"></div>
    </div>

    <table
      v-else
      class="table overflow-x-auto rounded-box border border-base-content/5 bg-base-100"
    >
      <thead class="bg-base-200">
        <tr>
          <th class="w-8 text-center">Tipo</th>
          <th>Nombre</th>
          <th>Contenidos</th>
          <th>Ultima Modificacion</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody v-if="items.length">
        <tr v-for="value in items">
          <td class="text-center">
            <i
              :class="{
                'fa-regular fa-folder fa-xl text-warning': value.tipo === 'carpeta',
                'fa-regular fa-file-lines fa-xl text-primary': value.tipo === 'banco',
              }"
            ></i>
          </td>
          <td>
            <div v-if="value.tipo === 'banco'">
              <p class="text-sm font-semibold">
                {{ value.nombre }}
              </p>
              <p class="text-xs text-base-content/70">
                {{ value.descripcion }}
              </p>
            </div>
            <div v-else>
              <p class="text-sm font-semibold">
                {{ value.nombre }}
              </p>
            </div>
          </td>
          <td>
            <p class="text-sm text-base-content/70">
              {{
                value.tipo === 'carpeta' ? `${value.bancos} bancos` : `${value.reactivos} reactivos`
              }}
            </p>
          </td>
          <td>
            <p class="text-sm text-base-content/70">
              {{
                new Date(value.fechaModificacion).toLocaleDateString('es-ES', {
                  dateStyle: 'medium',
                })
              }}
            </p>
          </td>
          <td></td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td colspan="6">
            <div class="flex flex-col items-center justify-center py-10 text-center">
              <i class="fa-regular fa-folder-open text-4xl text-base-content/40 mb-3"></i>

              <p class="font-semibold text-base-content/70">No hay elementos aún</p>

              <p class="text-sm text-base-content/50">
                Puedes crear una carpeta o banco para comenzar
              </p>

              <button class="btn btn-primary btn-sm mt-4">
                <i class="fa-regular fa-plus"></i>
                Crear elemento
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template> -->
<template>
  <div class="max-w-7xl mx-auto px-4">
    <!-- HEADER -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
      <div>
        <h1 class="text-2xl font-bold">Gestión de Bancos</h1>

        <p class="text-sm text-base-content/70">Administra carpetas y bancos de reactivos</p>
      </div>

      <div class="flex items-center gap-2">
        <!-- BOTON -->
        <button class="btn btn-primary">
          <i class="fa-regular fa-plus"></i>
          Crear
        </button>
      </div>
    </div>

    <!-- TABLA -->
    <div class="rounded-2xl border border-base-300 bg-base-100 shadow-sm overflow-visible">
      <!-- LOADING -->
      <div class="overflow-x-auto">
        <div v-if="loading" class="p-6 space-y-3">
          <div class="skeleton h-14 w-full"></div>
          <div class="skeleton h-16 w-full"></div>
          <div class="skeleton h-16 w-full"></div>
          <div class="skeleton h-16 w-full"></div>
        </div>

        <!-- TABLE -->
        <table v-else class="table table-fixed w-full">
          <!-- HEAD -->
          <thead class="bg-base-200">
            <tr>
              <th class="w-16 text-center">Tipo</th>

              <th class="min-w-62.5">Nombre</th>
              <th class="w-10"></th>

              <th class="w-40 text-center">Contenidos</th>

              <th class="w-52 text-center">Última modificación</th>

              <th class="w-32 text-center">Acciones</th>
            </tr>
          </thead>

          <!-- BODY -->
          <tbody v-if="items.length">
            <tr
              v-for="value in items"
              :key="value.id"
              class="hover transition-colors cursor-pointer"
            >
              <!-- ICON -->
              <td class="text-center align-middle">
                <div
                  class="w-10 h-10 rounded-xl flex items-center justify-center mx-auto"
                  :class="value.tipo === 'carpeta' ? 'bg-warning/10' : 'bg-primary/10'"
                >
                  <i
                    :class="{
                      'fa-regular fa-folder text-warning text-lg': value.tipo === 'carpeta',

                      'fa-regular fa-file-lines text-primary text-lg': value.tipo === 'banco',
                    }"
                  ></i>
                </div>
              </td>

              <!-- NAME -->
              <td class="align-middle">
                <div class="min-w-0">
                  <div class="flex items-center gap-2">
                    <p class="font-semibold truncate" :title="value.nombre">
                      {{ value.nombre }}
                    </p>
                  </div>

                  <p
                    v-if="value.tipo === 'banco'"
                    class="text-sm text-base-content/60 truncate mt-1"
                    :title="value.descripcion"
                  >
                    {{ value.descripcion }}
                  </p>
                </div>
              </td>
              <td>
                <div v-if="value.tipo === 'banco' && value.esCompartido === true">
                  <i class="fa-regular fa-share-nodes text-xl"></i>
                </div>
              </td>

              <!-- CONTENT -->
              <td class="text-center align-middle">
                <div class="flex justify-center">
                  <div class="badge badge-ghost">
                    {{
                      value.tipo === 'carpeta'
                        ? `${value.bancos} bancos`
                        : `${value.reactivos} reactivos`
                    }}
                  </div>
                </div>
              </td>

              <!-- DATE -->
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
              </td>

              <!-- ACTIONS -->
              <td class="text-center align-middle overflow-visible">
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

                  <button class="btn btn-primary mt-5">
                    <i class="fa-regular fa-plus"></i>
                    Crear elemento
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
