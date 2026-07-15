<!-- <script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ListaReactivos from '../banconormal/components/lista-reactivos.vue'
import ListaCompartidos from '../banconormal/components/lista-compartidos.vue'
import InfromacionBanco from '../banconormal/components/infromacion-banco.vue'
import { useQuery } from '@tanstack/vue-query'
import { getBancoById } from '@/api/bancos/actions/getBancoById.action.ts'

const route = useRoute()

const bancoId = String(route.params.id)

const esOrigenCompartidos = computed(() => route.query.origen === 'compartidos')

const { data } = useQuery({
  queryKey: ['BancoById', bancoId],
  queryFn: () => getBancoById(bancoId),
})
</script>

<template>
  <div class="bg-base-200 text-base-content">
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 box-border">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div class="min-w-0 lg:col-span-8 flex flex-col gap-10">
          <header class="space-y-4">
            <h1 class="text-3xl md:text-5xl font-semibold wrap-break-word">
              {{ data?.banco.nombre }} {{ data?.banco.bancoId }}
            </h1>
            <p class="text-base-content/70 max-w-2xl text-lg wrap-break-word">
              {{ data?.banco.descripcion }}
            </p>
          </header>

          <template v-if="data?.banco">
            <section class="card bg-base-100 shadow-sm border border-base-300 overflow-hidden">
              <div
                class="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-base-300"
              >
                <div class="p-6 flex flex-col min-h-0">
                  <ListaReactivos :banco="data" />
                </div>
                <div v-if="esOrigenCompartidos">
                  <div class="p-6">
                    <div class="flex flex-row items-center mb-4">
                      <i class="fa-regular fa-user text-primary pe-2"></i>
                      <h2 class="text-xs font-bold uppercase tracking-widest">Propietario</h2>
                    </div>
                    <div class="flex items-center gap-3">
                      <div class="avatar placeholder">
                        <div
                          class="w-8 h-8 rounded-full bg-primary text-white text-xs font-semibold"
                        >
                          <span>?</span>
                        </div>
                      </div>
                      <div>
                        <p class="text-xs font-semibold">
                          {{ data.banco.identidad.nombre }}
                          {{ data.banco.identidad.apellidoPaterno }}
                          {{ data.banco.identidad.apellidoMaterno }}
                        </p>
                        <p class="text-[10px] text-slate-500">Propietario</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else>
                  <ListaCompartidos :banco-id="data.banco.bancoId" />
                </div>
                <div>
                  <InfromacionBanco :banco="data" />
                </div>
              </div>
            </section>
          </template>
        </div>
      </div>
    </main>
  </div>
</template>
<style scoped>
/* * {
  outline: 1px solid red;
} */
</style> -->
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'

import ListaReactivos from '../banconormal/components/lista-reactivos.vue'
import ListaCompartidos from '../banconormal/components/lista-compartidos.vue'
import InfromacionBanco from '../banconormal/components/infromacion-banco.vue'

import { getBancoById } from '@/api/bancos/actions/getBancoById.action'

const route = useRoute()

const bancoId = route.params.id as string

const esOrigenCompartidos = computed(() => route.query.origen === 'compartidos')

const { data, isLoading } = useQuery({
  queryKey: ['BancoById', bancoId],
  queryFn: () => getBancoById(bancoId),
})
</script>

<template>
  <div class="bg-base-200 min-h-screen">
    <main class="max-w-7xl mx-auto px-6 py-8">
      <template v-if="isLoading">
        <div class="space-y-4">
          <div class="skeleton h-10 w-72"></div>
          <div class="skeleton h-5 w-full max-w-2xl"></div>

          <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">
            <div class="skeleton h-96 rounded-2xl"></div>
            <div class="skeleton h-96 rounded-2xl"></div>
            <div class="skeleton h-96 rounded-2xl"></div>
          </div>
        </div>
      </template>

      <template v-else-if="data">
        <!-- Encabezado -->
        <header class="mb-8">
          <div class="flex items-center gap-3 flex-wrap">
            <h1 class="text-4xl font-bold wrap-break-word">
              {{ data.nombre }}
            </h1>

            <div class="badge badge-primary badge-outline">#{{ data.idBanco }}</div>
          </div>

          <p v-if="data.descripcion" class="mt-3 text-base-content/70 max-w-3xl leading-relaxed">
            {{ data.descripcion }}
          </p>
        </header>

        <!-- Tarjetas -->
        <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch">
          <!-- Reactivos -->
          <div class="card bg-base-100 border border-base-300 shadow-sm h-full">
            <div class="p-6 h-full flex flex-col">
              <ListaReactivos :banco="data" />
            </div>
          </div>

          <!-- Compartidos / Propietario -->
          <div class="card bg-base-100 border border-base-300 shadow-sm h-full">
            <template v-if="esOrigenCompartidos">
              <div class="p-6 h-full flex flex-col">
                <div class="flex items-center gap-2 mb-6">
                  <i class="fa-regular fa-user text-primary"></i>

                  <h2 class="text-xs font-bold uppercase tracking-widest">Propietario</h2>
                </div>

                <div class="flex items-center gap-4">
                  <div
                    class="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold"
                  >
                    {{ data.propietario.nombre.charAt(0).toUpperCase() }}
                    {{ data.propietario.apellidoPaterno.charAt(0).toUpperCase() }}
                  </div>

                  <div>
                    <p class="font-semibold">
                      {{ data.propietario.nombre }}
                      {{ data.propietario.apellidoPaterno }}
                      {{ data.propietario.apellidoMaterno }}
                    </p>

                    <span class="badge badge-primary badge-sm mt-1"> Propietario </span>
                  </div>
                </div>
              </div>
            </template>

            <template v-else>
              <div class="p-6 h-full flex flex-col">
                <ListaCompartidos :banco="data" />
              </div>
            </template>
          </div>

          <!-- Información -->
          <div class="card bg-base-100 border border-base-300 shadow-sm h-full">
            <div class="p-6 h-full flex flex-col">
              <InfromacionBanco :banco="data" />
            </div>
          </div>
        </div>
      </template>
    </main>
  </div>
</template>
