<template>
  <div class="max-w-7xl mx-auto px-4">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
      <div>
        <h1 class="text-2xl font-bold">Gestión de Bancos Compartidos</h1>

        <p class="text-sm text-base-content/70">Administra carpetas y bancos de reactivos</p>
      </div>
    </div>
  <div class="rounded-box border border-base-300 bg-base-100 shadow-sm overflow-visible">
    <div class="overflow-visible">
      <div v-if="isLoading" class="p-6 space-y-3">
        <div class="skeleton h-14 w-full"></div>
        <div class="skeleton h-16 w-full"></div>
        <div class="skeleton h-16 w-full"></div>
        <div class="skeleton h-16 w-full"></div>
      </div>
      <!-- TABLE 1 -->
      <table v-else class="table table-fixed w-full block overflow-x-auto whitespace-nowrap">
        <!-- HEAD -->
        <thead class="bg-base-200">
          <tr>
            <th class="w-16 text-center">Tipo</th>

            <th class="min-w-62.5">Nombre</th>

            <th class="w-40 text-center">Contenido</th>

            <th class="w-52 text-center">Última modificación</th>

            <!-- <th class="w-40 text-center">Compartido</th> -->

            <th class="w-32 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody v-if="data && data?.length > 0">
          <tr
            v-for="value in data"
            :key="value.bancoId"
            class="hover transition-colors cursor-pointer"
            @click="irABanco(value.bancoId)"
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
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="5">
              <div class="flex flex-col items-center py-16">
                <div
                  class="w-20 h-20 rounded-full bg-base-200 flex items-center justify-center mb-4"
                >
                  <i class="fa-regular fa-file-export text-4xl text-base-content/40"></i>
                </div>

                <h2 class="text-lg font-bold">No hay bancos compartidos contigo</h2>

                <p class="text-sm text-base-content/60 mt-1">
                  Aqui puedes visualizar los bancos compartidos contigo
                </p>

                <!-- <div class="flex items-center gap-2 mt-5">
                  <button class="btn bg-white" @click="">
                    <i class="fa-regular fa-user"></i>
                    Nuevo Usuario
                  </button>
                </div> -->
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  </div>
</template>

<script lang="ts" setup>
import { getBancosCompartidosAction } from '@/api/bancos/compartidos/actions/get-bancosCompartidos.action'
import { useQuery } from '@tanstack/vue-query'
import { useRouter } from 'vue-router'

const router = useRouter()

const { data, isLoading } = useQuery({
  queryKey: ['Compartidos'],
  queryFn: () => getBancosCompartidosAction(),
})

function irABanco(bancoId: number) {
  router.push({
    name: 'bancoDetalle',
    params: { id: bancoId },
    query: { origen: 'compartidos' },
  })
}
</script>
