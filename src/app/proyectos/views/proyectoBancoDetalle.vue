<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'

import { getProyectoDetalleAction } from '@/api/proyectos/actions/get-proyecto-detalle.action'
import WorkflowStepper from '@/app/common/components/WorkflowStepper.vue'

const route = useRoute()
const proyectoId = String(route.params.id)

const { data, isLoading, isError } = useQuery({
  queryKey: ['proyecto', proyectoId],
  queryFn: () => getProyectoDetalleAction(proyectoId),
})

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
    <main class="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      <template v-if="isLoading">
        <div class="space-y-6">
          <div class="skeleton h-36 w-full rounded-2xl"></div>
          <div class="skeleton h-72 w-full rounded-2xl"></div>
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div v-for="i in 3" :key="i" class="skeleton h-96 rounded-2xl"></div>
          </div>
          <div class="skeleton h-44 w-full rounded-2xl"></div>
        </div>
      </template>

      <div
        v-else-if="isError || !data"
        class="rounded-2xl bg-base-100 border border-error/30 p-10 text-center"
      >
        <div
          class="size-16 rounded-full bg-error/10 text-error flex items-center justify-center mx-auto"
        >
          <i class="fa-regular fa-triangle-exclamation text-2xl"></i>
        </div>
        <h1 class="text-xl font-bold mt-4">No se pudo cargar el proyecto</h1>
        <p class="text-sm text-base-content/60 mt-2">
          Verifica que el proyecto exista o intenta nuevamente.
        </p>
      </div>

      <template v-else>
        <!-- Encabezado del proyecto -->
        <header class="card bg-base-100 border border-base-300 shadow-sm p-6 sm:p-8">
          <div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div class="space-y-3 min-w-0">
              <div class="flex flex-wrap items-center gap-3">
                <h1 class="text-2xl sm:text-3xl font-bold tracking-tight wrap-break-word">
                  {{ data.nombre }}
                </h1>
                <span
                  class="inline-flex items-center rounded-full bg-base-200 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-base-content/70 border border-base-300"
                >
                  Proyecto
                </span>
              </div>
              <p
                v-if="data.descripcion"
                class="text-sm text-base-content/70 max-w-4xl leading-relaxed"
              >
                {{ data.descripcion }}
              </p>

              <div class="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                <span
                  class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-medium ring-1 ring-inset"
                  :class="
                    data.estado.nombre === 'En Proceso'
                      ? 'bg-info/10 text-info ring-info/30'
                      : 'bg-success/10 text-success ring-success/30'
                  "
                >
                  <span>
                    <div
                      aria-label="status"
                      class="status status-info status-lg animate-spin"
                    ></div>
                  </span>
                  {{ data.estado.nombre }}
                </span>

                <span class="inline-flex items-center gap-1.5 text-xs text-base-content/50 pl-1">
                  <i class="fa-regular fa-clock"></i>
                  Actualizado {{ formatearFecha(data.fechaModificacion) }}
                </span>
              </div>
            </div>

            <div class="flex items-center gap-2.5 self-start md:self-center">
              <button type="button" title="Disponible próximamente" class="btn">
                <i class="fa-solid fa-pen-to-square"></i>
                Editar proyecto
              </button>
            </div>
          </div>
        </header>

        <!-- Flujo de trabajo -->
        <section class="card bg-base-100 border border-base-300 shadow-sm p-6 sm:p-7">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6">
            <div class="flex items-center gap-2.5">
              <div class="p-2 bg-primary/10 text-primary rounded-lg">
                <i class="fa-solid fa-arrow-progress"></i>
              </div>
              <div>
                <h2 class="text-sm font-bold tracking-wider uppercase">Flujo de Trabajo</h2>
                <p class="text-xs sm:text-sm text-base-content/60">
                  Consulta el avance y la fase actual del ciclo de vida del proyecto.
                </p>
              </div>
            </div>

            <div
              class="flex items-center gap-2 text-xs font-medium text-base-content/60 bg-base-200/60 px-3 py-1.5 rounded-full border border-base-200 self-start sm:self-auto"
            >
              <span class="h-2 w-2 rounded-full bg-primary"></span>
              <!-- <span>Paso {{ pasoActual }} de {{ totalPasos }}</span> -->
              <span class="text-base-content/30">•</span>
            </div>
          </div>

          <WorkflowStepper :fases="data.fases" size="compact" />
        </section>

        <!-- Paneles de contenido -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          <!-- <PanelReactivos :banco="data" />
          <ListaMiembros :propietario="data.propietario" /> -->
          <!-- <PanelInformacion :banco="data " /> -->
        </div>

        <!-- <HallazgosPanel :hallazgos="hallazgos" /> -->
      </template>
    </main>
  </div>
</template>
