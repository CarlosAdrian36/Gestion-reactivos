<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<!-- eslint-disable vue/multi-word-component-names -->
// eslint-disable-next-line vue/multi-word-component-names
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
      fecha: string
      bancos: number
    }
  | {
      tipo: 'banco'
      id: number
      nombre: string
      descripcion: string
      fecha: string
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

<template>
  <div v-if="loading" class="space-y-2">
    <div class="skeleton h-12 w-full"></div>
    <div class="skeleton h-12 w-full"></div>
    <div class="skeleton h-12 w-full"></div>
  </div>

  <table v-else class="table">
    <tbody>
      <tr v-for="item in items" :key="`${item.tipo}-${item.id}`">
        <td>
          <span v-if="item.tipo === 'carpeta'"> 📁 </span>

          <span v-else> 📄 </span>
        </td>

        <td>
          {{ item.nombre }}
        </td>
      </tr>
    </tbody>
  </table>

  <table class="table w-full">
    <thead class="bg-base-200">
      <tr>
        <th class="w-8 text-center">Tipo</th>
        <th>Nombre</th>
        <th>Estatus</th>
        <th>Contenidos</th>
        <th>Ultima Modificacion</th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="items.length" class=""></tr>
      <tr v-else>
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
</template>
