<template>
  <div class="flex flex-col h-full">
    <div class="flex flex-row items-center mb-4">
      <button class="btn btn-ghost btn-sm gap-2 px-3 py-2 rounded-lg hover:bg-base-200">
        <i class="fa-regular fa-ballot-check text-primary pe-2"></i>
        <h2 class="text-xs font-bold uppercase tracking-widest">Listado de Reactivos</h2>
      </button>
    </div>

    <!-- Contenido -->
    <div class="grow overflow-y-auto max-h-80 pr-2 space-y-2">
      <div v-if="banco.banco.cantidadReactivos === 0">
        <div
          class="size-20 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-5"
        >
          <i class="fa-regular fa-file-circle-plus text-4xl"></i>
        </div>

        <h3 class="font-bold text-lg">No hay reactivos</h3>

        <p class="text-sm text-base-content/60 mt-2 max-w-xs">
          Comienza agregando el primer reactivo a este banco para empezar a trabajar.
        </p>
      </div>

      <div v-else>
        <!-- Lista de reactivos -->
      </div>
    </div>

    <!-- Botón -->
    <button
      class="btn btn-dash btn-block hover:border-primary hover:text-primary hover:bg-base-100 btn-sm rounded-lg border-dashed border-slate-300 mt-auto"
    >
      Crear Reactivo
    </button>
  </div>
</template>

<script setup lang="ts">
import type { BancoByID } from '@/api/bancos/interfaces/bancoById.interface'

defineProps<{
  banco: BancoByID
}>()
</script>
