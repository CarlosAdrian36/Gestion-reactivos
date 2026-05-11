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
  <table class="table">
    <tbody>
      <tr v-for="item in items" :key="`${item.tipo}-${item.id}`">
        <td>
          <span v-if="item.tipo === 'carpeta'"> 📁 </span>

          <span v-else> 📄 </span>
        </td>

        <td>
          {{ item.nombre }}
        </td>

        <td>
          <template v-if="item.tipo === 'carpeta'"> {{ item.bancos }} bancos </template>

          <template v-else> {{ item.reactivos }} reactivos </template>
        </td>
      </tr>
    </tbody>
  </table>
</template>
