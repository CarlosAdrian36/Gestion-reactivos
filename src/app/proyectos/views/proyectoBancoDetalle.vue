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
    <main class="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 sm:py-8 space-y-5">
      <template v-if="isLoading">
        <div class="space-y-6">
          <div class="skeleton h-36 w-full rounded-xl"></div>
          <div class="grid grid-cols-1 xl:grid-cols-12 gap-5">
            <div class="skeleton h-72 rounded-xl xl:col-span-4"></div>
            <div class="skeleton h-72 rounded-xl xl:col-span-8"></div>
          </div>
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div class="skeleton h-72 rounded-xl lg:col-span-8"></div>
            <div class="skeleton h-72 rounded-xl lg:col-span-4"></div>
          </div>
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
        <header class="card bg-base-100 border border-base-300 shadow-sm p-5 sm:p-6">
          <div class="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div class="min-w-0 space-y-3">
              <div class="flex flex-wrap items-center gap-3">
                <h1 class="text-2xl sm:text-3xl font-bold tracking-tight wrap-break-word">
                  {{ data.nombre }}
                </h1>
                <span class="badge badge-outline">Proyecto</span>
              </div>

              <p v-if="data.descripcion" class="max-w-4xl text-sm text-base-content/70">
                {{ data.descripcion }}
              </p>

              <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                <span
                  class="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 font-medium ring-1 ring-inset"
                  :class="
                    data.estado.nombre === 'En Proceso'
                      ? 'bg-info/10 text-info ring-info/30'
                      : 'bg-success/10 text-success ring-success/30'
                  "
                >
                  <span
                    class="size-2 rounded-full"
                    :class="data.estado.nombre === 'En Proceso' ? 'bg-info' : 'bg-success'"
                  ></span>
                  {{ data.estado.nombre }}
                </span>

                <span class="inline-flex items-center gap-2 text-xs text-base-content/60">
                  <i class="fa-regular fa-clock"></i>
                  Actualizado {{ formatearFecha(data.fechaModificacion) }}
                </span>
              </div>
            </div>

            <button
              type="button"
              title="Disponible próximamente"
              class="btn self-start xl:self-center"
            >
              <i class="fa-solid fa-pen-to-square"></i>
              Editar proyecto
            </button>
          </div>
        </header>

        <!-- Zona operativa: flujo y hallazgos como contenido principal -->
        <div class="grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
          <section
            class="card min-w-0 bg-base-100 border border-primary/20 shadow-sm p-5 sm:p-6 xl:col-span-4"
          >
            <div class="flex items-center gap-3 pb-5 border-b border-base-200">
              <div
                class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"
              >
                <i class="fa-solid fa-arrow-progress"></i>
              </div>
              <div>
                <h2 class="text-sm font-bold uppercase tracking-wider">Flujo de trabajo</h2>
                <p class="mt-1 text-xs text-base-content/60">Fases del proyecto</p>
              </div>
            </div>

            <div class="flex min-h-52 items-center py-5">
              <WorkflowStepper :fases="data.fases" :estado="data.estado" size="compact" />
            </div>
          </section>

          <section
            class="card min-w-0 bg-base-100 border border-base-300 shadow-sm p-5 sm:p-6 xl:col-span-8"
          >
            <div class="flex items-center gap-3 pb-5 border-b border-base-200">
              <div
                class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-warning/10 text-warning"
              >
                <i class="fa-regular fa-note-sticky"></i>
              </div>
              <div>
                <h2 class="text-sm font-bold uppercase tracking-wider">Hallazgos y auditoría</h2>
                <p class="mt-1 text-xs text-base-content/60">Área de contenido</p>
              </div>
            </div>
            <!-- Espacio reservado para conectar los datos de hallazgos. -->
            <div class="min-h-52 flex-1"></div>
          </section>
        </div>

        <!-- Secciones secundarias del proyecto -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          <section
            class="card min-w-0 bg-base-100 border border-base-300 shadow-sm p-5 sm:p-6 lg:col-span-8"
          >
            <div class="flex items-center gap-3 pb-5 border-b border-base-200">
              <div
                class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"
              >
                <i class="fa-regular fa-file-lines"></i>
              </div>
              <div>
                <h2 class="text-sm font-bold uppercase tracking-wider">Reactivos</h2>
                <p class="mt-1 text-xs text-base-content/60">Contenido del banco</p>
              </div>
            </div>
            <!-- Espacio reservado para conectar los datos de reactivos. -->
            <div class="min-h-56 flex-1"></div>
          </section>

          <section
            class="card min-w-0 bg-base-100 border border-base-300 shadow-sm p-5 sm:p-6 lg:col-span-4"
          >
            <div class="flex items-center gap-3 pb-5 border-b border-base-200">
              <div
                class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary/10 text-secondary"
              >
                <i class="fa-regular fa-users"></i>
              </div>
              <div>
                <h2 class="text-sm font-bold uppercase tracking-wider">Equipo</h2>
                <p class="mt-1 text-xs text-base-content/60">Personas del proyecto</p>
              </div>
            </div>
            <!-- Espacio reservado para conectar los datos del equipo. -->
            <div class="min-h-56 flex-1"></div>
          </section>
        </div>
      </template>
    </main>
  </div>
</template>
