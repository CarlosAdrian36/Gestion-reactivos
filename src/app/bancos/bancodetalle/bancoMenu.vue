<script setup lang="ts">
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
              {{ data?.banco.nombre }}
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
                  <ListaReactivos :banco="data.banco" />
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
                          {{ data.banco.propietarioCuentaId ?? 'Usuario desconocido' }}
                        </p>
                        <p class="text-[10px] text-slate-500">Propietario</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else>
                  <ListaCompartidos />
                </div>
                <div>
                  <InfromacionBanco :banco="data.banco" />
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
</style>
