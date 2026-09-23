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
  staleTime: 1000 * 60,
  refetchOnWindowFocus: true,
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
