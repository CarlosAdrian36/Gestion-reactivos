<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'

import { getBancoById } from '@/api/bancos/actions/getBancoById.action'
import { getProyectoDetalleAction } from '@/api/proyectos/actions/get-proyecto-detalle.action'
import type { Hallazgo } from '@/api/proyectos/interfaces/proyecto.interface'
import WorkflowStepper from '@/app/common/components/WorkflowStepper.vue'
import ListaReactivos from '@/app/bancos/banconormal/components/lista-reactivos.vue'
import InfromacionBanco from '@/app/bancos/banconormal/components/infromacion-banco.vue'
import ListaMiembros from '@/app/proyectos/components/ListaMiembros.vue'
import HallazgosPanel from '@/app/proyectos/components/HallazgosPanel.vue'

const route = useRoute()
const proyectoId = String(route.params.id)

const { data: proyecto, isLoading: proyectoCargando, isError: proyectoError } = useQuery({
  queryKey: ['proyecto', proyectoId],
  queryFn: () => getProyectoDetalleAction(proyectoId),
  staleTime: 1000 * 60,
  refetchOnWindowFocus: true,
})

const { data: banco, isLoading: bancoCargando, isError: bancoError } = useQuery({
  queryKey: ['BancoById', proyectoId],
  queryFn: () => getBancoById(proyectoId),
  staleTime: 1000 * 60,
  refetchOnWindowFocus: true,
})

const hallazgos = ref<Hallazgo[]>([])
const isLoading = computed(() => proyectoCargando.value || bancoCargando.value)
const hasError = computed(() => proyectoError.value || bancoError.value)

function formatearFecha(fecha: string): string {
  return new Date(fecha).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>

<template>
  <div class="min-h-full">
    <main class="max-w-7xl mx-auto px-2 sm:px-4 py-6 sm:py-8">
      <template v-if="isLoading">
        <div class="space-y-4">
          <div class="skeleton h-12 w-3/4"></div>
          <div class="skeleton h-5 w-full max-w-2xl"></div>
          <div class="skeleton h-60 w-full rounded-2xl mt-8"></div>
          <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
            <div v-for="i in 3" :key="i" class="skeleton h-80 rounded-2xl"></div>
          </div>
        </div>
      </template>

      <div v-else-if="hasError || !proyecto || !banco" class="rounded-2xl bg-base-100 border border-error/30 p-10 text-center">
        <div class="size-16 rounded-full bg-error/10 text-error flex items-center justify-center mx-auto">
          <i class="fa-regular fa-triangle-exclamation text-2xl"></i>
        </div>
        <h1 class="text-xl font-bold mt-4">No se pudo cargar el proyecto</h1>
        <p class="text-sm text-base-content/60 mt-2">
          Verifica que el proyecto exista o intenta nuevamente.
        </p>
      </div>

      <template v-else>
        <header class="mb-7">
          <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div class="min-w-0">
              <div class="flex items-center gap-3 flex-wrap">
                <h1 class="text-3xl sm:text-4xl font-bold wrap-break-word">
                  {{ proyecto.nombre }}
                </h1>
                <span class="badge badge-primary badge-outline">Proyecto</span>
              </div>
              <p v-if="proyecto.descripcion" class="mt-3 text-base-content/70 max-w-4xl leading-relaxed">
                {{ proyecto.descripcion }}
              </p>
            </div>

            <div class="flex flex-wrap items-center gap-2 shrink-0">
              <span class="badge badge-lg" :class="proyecto.estado.nombre === 'Completada' ? 'badge-success' : 'badge-info'">
                {{ proyecto.estado.nombre }}
              </span>
              <span v-if="proyecto.fechaEntrega" class="badge badge-ghost badge-lg">
                Entrega: {{ formatearFecha(proyecto.fechaEntrega) }}
              </span>
            </div>
          </div>
        </header>

        <section class="rounded-2xl bg-base-100 border border-base-300 shadow-sm p-5 sm:p-7">
          <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
            <div>
              <div class="flex items-center gap-2">
                <i class="fa-regular fa-route text-primary"></i>
                <h2 class="text-sm font-bold uppercase tracking-widest">Flujo de trabajo</h2>
              </div>
              <p class="text-sm text-base-content/60 mt-2">
                Consulta el avance y la fase actual del proyecto.
              </p>
            </div>
            <span class="text-xs text-base-content/50">
              Actualizado {{ formatearFecha(proyecto.fechaModificacion) }}
            </span>
          </div>

          <WorkflowStepper :fases="proyecto.fases" :estado="proyecto.estado" size="large" />
        </section>

        <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6 items-stretch">
          <div class="card bg-base-100 border border-base-300 shadow-sm min-h-80">
            <div class="p-6 h-full">
              <ListaReactivos :banco="banco" />
            </div>
          </div>

          <div class="card bg-base-100 border border-base-300 shadow-sm min-h-80">
            <div class="p-6 h-full">
              <ListaMiembros :propietario="proyecto.propietario" />
            </div>
          </div>

          <div class="card bg-base-100 border border-base-300 shadow-sm min-h-80">
            <div class="p-6 h-full">
              <InfromacionBanco :banco="banco" />
            </div>
          </div>
        </div>

        <div class="mt-6">
          <HallazgosPanel :hallazgos="hallazgos" />
        </div>
      </template>
    </main>
  </div>
</template>
