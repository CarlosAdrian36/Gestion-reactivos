<template>
  <div class="flex flex-row items-center mb-4">
    <i class="fa-regular fa-ballot-check text-primary pe-2"></i>
    <h2 class="text-xs font-bold uppercase tracking-widest">Listado de Reactivos</h2>
  </div>

  <div class="space-y-2 grow overflow-y-auto max-h-80 pr-2 pb-6">
    <div v-if="banco.cantidadReactivos === 0">No hay reactivos aun</div>
    <div v-else></div>
  </div>
</template>
<script lang="ts" setup>
import type { Banco } from '@/api/bancos/interfaces/banco.interface'

defineProps<{
  banco: Banco
}>()
</script>
