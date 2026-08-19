<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { getBancosAction } from '@/api/bancos/actions/get-bancos.actions'
import type { Banco } from '@/api/bancos/interfaces/banco.interface'
import router from '@/router'

const bancos = ref<Banco[]>([])
const loading = ref(true)

const proyectos = computed(() => bancos.value.filter((b) => b.esProyecto))

onMounted(async () => {
  try {
    bancos.value = await getBancosAction()
  } finally {
    loading.value = false
  }
})

const goToItem = (item: Banco) => {
  if (item.esProyecto === true) {
    router.push({ name: 'bancoDetalle', params: { id: item.idBanco } })
  } else {
    console.log('Carpeta seleccionada:', item.nombre)
  }
}
</script>

<template>
  <!-- metodo /getProyectos -->
  <div class="max-w-7xl mx-auto px-4">
    <!-- HEADER -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
      <div>
        <h1 class="text-2xl font-bold">Gestión de Proyectos</h1>

        <p class="text-sm text-base-content/70">
          Administra carpetas y bancos de reactivos con flujos de trabajo
        </p>
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
    <div class="rounded-box border border-base-300 bg-base-100 shadow-sm overflow-visible">
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

              <th class="w-40 text-center">Contenidos</th>

              <th class="w-52 text-center">Última modificación</th>

              <th class="w-32 text-center">Acciones</th>
            </tr>
          </thead>

          <!-- BODY -->
          <tbody v-if="bancos.length">
            <tr
              v-for="value in proyectos"
              :key="value.idBanco"
              class="hover transition-colors cursor-pointer"
              @click="goToItem(value)"
            >
              <!-- ICON -->
              <td class="text-center align-middle">
                <div
                  class="w-10 h-10 rounded-xl flex items-center justify-center mx-auto bg-primary/10"
                >
                  <i class="fa-regular fa-file-lines text-primary text-lg"></i>
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

                  <p class="text-sm text-base-content/60 truncate mt-1" :title="value.descripcion">
                    {{ value.descripcion }}
                  </p>
                </div>
              </td>

              <!-- CONTENT -->
              <td class="text-center align-middle">
                <div class="flex justify-center">
                  <div class="badge badge-ghost">{{ value.cantidadReactivos }} reactivos</div>
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
