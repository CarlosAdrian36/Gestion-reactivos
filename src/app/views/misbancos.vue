<script lang="ts" setup>
import { getItemsUnificadosAction } from '@/app/unifiacados/actions/get-items-unificados.actions'
import { useQuery } from '@tanstack/vue-query'
import { useMediaQuery } from '@vueuse/core'
import type { ItemUnificado } from '../unifiacados/interface/item-unificado.interface'
import { watchEffect } from 'vue'

const { data, isLoading, error, isError } = useQuery({
  queryKey: ['items-unificados'],
  queryFn: () => getItemsUnificadosAction(),
  staleTime: 1000 * 60, // 1 minutes
  // refetchOnMount: true, // refetch si está stale al montar
  // refetchOnWindowFocus: true, // refetch al volver a la pestaña
  // refetchOnReconnect: true, // refetch al recuperar red
})
watchEffect(() => {
  console.log({
    data: data.value,
    error: error.value,
    isError: isError.value,
  })
})
const itemClass = (item: ItemUnificado) => {
  return item.tipo === 'banco' ? ' bg-primary/10' : 'bg-warning/10'
}
const isMobile = useMediaQuery('(max-width: 768px)')
</script>

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
        <!-- <button class="btn btn-primary">
          <i class="fa-regular fa-plus"></i>
          Crear
        </button> -->

        <div class="dropdown dropdown-bottom dropdown-end">
          <div tabindex="0" role="button" class="btn btn-primary">
            <i class="fa-regular fa-plus"></i>Crear
          </div>

          <ul
            tabindex="1"
            class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
          >
            <li class="pb-2">
              <button class="btn btn-soft btn-info" @click="">Banco de Reactivos</button>
            </li>
            <li>
              <button class="btn btn-soft btn-warning" @click="">Carpeta</button>
            </li>
          </ul>
        </div>
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

              <th class="w-40 text-center">Compartido</th>

              <th class="w-40 text-center">Elementos</th>

              <th class="w-52 text-center">Última modificación</th>

              <th class="w-32 text-center">Acciones</th>
            </tr>
          </thead>

          <!-- BODY -->
          <tbody v-if="data && data.length > 0">
            <tr
              v-for="value in data"
              :key="value.id"
              class="hover transition-colors cursor-pointer"
            >
              <!-- ICON -->
              <td class="text-center align-middle">
                <div
                  class="w-10 h-10 rounded-xl flex items-center justify-center mx-auto"
                  :class="itemClass(value)"
                >
                  <i class="fa-regular fa-file-lines text-primary text-lg"></i>
                  <!-- 'fa-regular fa-folder text-warning text-lg': value.tipo === 'carpeta', -->
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
                    v-if="value.descripcion"
                    class="text-sm text-base-content/60 truncate mt-1"
                    :title="value.descripcion"
                  >
                    {{ value.descripcion }}
                  </p>
                </div>
              </td>
              <!-- <td>
                <div v-if="value.tipo === 'banco' && value.esCompartido === true">
                  <i class="fa-regular fa-share-nodes text-xl"></i>
                </div>
              </td> -->

              <!-- CONTENT -->
              <td class="text-center align-middle">
                <div class="flex justify-center">
                  <div class="badge badge-ghost">
                    {{ value.compartido }}
                  </div>
                </div>
              </td>

              <td class="text-center align-middle">
                <div class="flex justify-center">
                  <div class="badge badge-ghost">{{ value.id }}</div>
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
                <span class="text-sm text-base-content/60">
                  {{
                    new Date(value.fechaModificacion).toLocaleTimeString('es-ES', {
                      timeStyle: 'short',
                    })
                  }}
                </span>
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
