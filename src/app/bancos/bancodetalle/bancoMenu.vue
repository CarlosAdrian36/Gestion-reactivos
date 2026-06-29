<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ListaReactivos from '../banconormal/components/lista-reactivos.vue'
import ListaCompartidos from '../banconormal/components/lista-compartidos.vue'
import InfromacionBanco from '../banconormal/components/infromacion-banco.vue'

const route = useRoute()

const bancoId = route.params.id

console.log(bancoId)

onMounted(async () => {})
</script>

<template>
  <!-- {{ bancoStore.selectedBanco?.esProyecto ? 'Es un proyecto' : 'No es un proyecto' }} -->
  <div class="bg-base-200 text-base-content">
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 box-border">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div class="min-w-0 lg:col-span-8 flex flex-col gap-10">
          <header class="space-y-4">
            <h1 class="text-3xl md:text-5xl font-semibold wrap-break-word">
              {{}} aqui el nombre
              {{ bancoId }}
            </h1>
            <p class="text-base-content/70 max-w-2xl text-lg wrap-break-word">
              aqui la descripcion
            </p>
          </header>

          <section class="card bg-base-100 shadow-sm border border-base-300 overflow-hidden">
            <div
              class="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-base-300"
            >
              <div class="p-6 flex flex-col min-h-0">
                <ListaReactivos />
              </div>
              <div>
                <ListaCompartidos />
              </div>
              <div>
                <InfromacionBanco />
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  </div>
</template>
<style scoped>
/* * {
  outline: 1px solid red;
} */
</style>
