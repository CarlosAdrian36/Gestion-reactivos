<template>
  <div class="max-w-7xl mx-autopx-4">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
      <div>
        <h1 class="text-2xl font-bold">Carpeta: {{ carpetaId }}</h1>

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
          <tbody v-if="data">
            {{
              data
            }}
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

                  <div v-if="!data?.length" class="flex items-center gap-2 mt-5">
                    <button class="btn btn-primary" @click="abrirModalBanco(carpetaId)">
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
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const modal = useModalStore()
const route = useRoute()

const carpetaId = computed(() => Number(route.params.id))

const { data, isLoading } = useQuery({
  queryKey: ['bancos-carpeta', carpetaId],
  queryFn: () => getBancoCarpetaAction(carpetaId.value),
})

function abrirModalBanco(carpetaId?: number, banco?: Banco) {
  console.warn(carpetaId)
  modal.openModal(NuevoBanco, { carpetaId, banco }, [
    { label: 'Cerrar', variant: 'outline' },
    { label: 'Guardar', variant: 'primary', type: 'submit' },
  ])
}
</script>
