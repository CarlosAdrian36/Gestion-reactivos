<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'

import { getBancoById } from '@/api/bancos/actions/getBancoById.action'
import { getProyectoDetalleAction } from '@/api/proyectos/actions/get-proyecto-detalle.action'
import type { Hallazgo } from '@/api/proyectos/interfaces/proyecto.interface'
import WorkflowStepper from '@/app/common/components/WorkflowStepper.vue'
import PanelReactivos from '@/app/proyectos/components/PanelReactivos.vue'
// import PanelInformacion from '@/app/proyectos/components/PanelInformacion.vue'
import ListaMiembros from '@/app/proyectos/components/ListaMiembros.vue'
import HallazgosPanel from '@/app/proyectos/components/HallazgosPanel.vue'

const route = useRoute()
const proyectoId = String(route.params.id)

const {
  data: proyecto,
  isLoading: proyectoCargando,
  isError: proyectoError,
} = useQuery({
  queryKey: ['proyecto', proyectoId],
  queryFn: () => getProyectoDetalleAction(proyectoId),
  staleTime: 1000 * 60,
  refetchOnWindowFocus: true,
})

const {
  data: banco,
  isLoading: bancoCargando,
  isError: bancoError,
} = useQuery({
  queryKey: ['BancoById', proyectoId],
  queryFn: () => getBancoById(proyectoId),
  staleTime: 1000 * 60,
  refetchOnWindowFocus: true,
})

const hallazgos = ref<Hallazgo[]>([])
const isLoading = computed(() => proyectoCargando.value || bancoCargando.value)
const hasError = computed(() => proyectoError.value || bancoError.value)

const proyectoCompletado = computed(() => proyecto.value?.estado.nombre === 'Completada')

const fasesProyecto = computed(
  () => proyecto.value?.fases.filter((fase) => fase.nombre !== 'Finalizado') ?? [],
)

const totalPasos = computed(() => fasesProyecto.value.length + 1)

const indiceFaseActual = computed(() => {
  const fases = fasesProyecto.value
  if (fases.length === 0) return 0
  if (fases.every((fase) => fase.estado === 'Completada')) return fases.length
  const enProceso = fases.findIndex((fase) => fase.estado === 'En proceso')
  if (enProceso !== -1) return enProceso
  return Math.max(
    fases.findIndex((fase) => fase.estado !== 'Completada'),
    0,
  )
})

const pasoActual = computed(() => Math.min(indiceFaseActual.value + 1, totalPasos.value))
const progreso = computed(() => Math.round((pasoActual.value / totalPasos.value) * 100))

function formatearFecha(fecha: string): string {
  return new Date(fecha).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const idCopiado = ref(false)

async function copiarIdBanco(): Promise<void> {
  try {
    await navigator.clipboard.writeText(banco.value?.idBanco ?? '')
    idCopiado.value = true
    setTimeout(() => {
      idCopiado.value = false
    }, 2000)
  } catch {
    // El portapapeles no está disponible en este contexto
  }
}
</script>

<template>
  <div class="min-h-full">
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
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
        v-else-if="hasError || !proyecto || !banco"
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
                  {{ proyecto.nombre }}
                </h1>
                <span
                  class="inline-flex items-center rounded-full bg-base-200 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-base-content/70 border border-base-300"
                >
                  Proyecto
                </span>
              </div>
              <p
                v-if="proyecto.descripcion"
                class="text-sm text-base-content/70 max-w-4xl leading-relaxed"
              >
                {{ proyecto.descripcion }}
              </p>

              <div class="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                <span
                  class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-medium ring-1 ring-inset"
                  :class="
                    proyectoCompletado
                      ? 'bg-success/10 text-success ring-success/25'
                      : 'bg-primary/10 text-primary ring-primary/20'
                  "
                >
                  <!-- :class="proyectoCompletado ? 'bg-success' : 'bg-primary animate-pulse'" -->
                  <span>
                    <div
                      aria-label="status"
                      :class="
                        proyectoCompletado
                          ? ' status status-success animate-bounce'
                          : 'status status-primary animate-bounce'
                      "
                    ></div>
                  </span>
                  {{ proyecto.estado.nombre }}
                </span>

                <!-- <span
                  v-if="proyecto.fechaEntrega"
                  class="inline-flex items-center gap-1.5 rounded-full bg-base-200/90 px-3 py-1 font-medium text-base-content/80"
                >
                  <i class="fa-regular fa-calendar text-base-content/50"></i>
                  Entrega:
                  <span class="font-semibold text-base-content ml-0.5">
                    {{ formatearFecha(proyecto.fechaEntrega) }}
                  </span>
                </span> -->

                <span class="inline-flex items-center gap-1.5 text-xs text-base-content/50 pl-1">
                  <i class="fa-regular fa-clock"></i>
                  Actualizado {{ formatearFecha(proyecto.fechaModificacion) }}
                </span>

                <!-- ID del banco -->
                <!-- <span class="inline-flex items-center gap-1.5 text-xs text-base-content/50">
                  <i class="fa-solid fa-fingerprint"></i>
                  ID del banco:
                  <span
                    class="font-mono font-medium text-base-content/70 truncate max-w-36 sm:max-w-80"
                    :title="banco.idBanco"
                  >
                    {{ banco.idBanco }}
                  </span>
                  <button
                    type="button"
                    class="p-1.5 text-base-content/40 hover:text-primary hover:bg-primary/10 rounded-lg transition"
                    :title="idCopiado ? '¡Copiado!' : 'Copiar ID al portapapeles'"
                    @click="copiarIdBanco"
                  >
                    <i v-if="idCopiado" class="fa-solid fa-check text-success"></i>
                    <i v-else class="fa-regular fa-copy"></i>
                  </button>
                </span> -->
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
          <div
            class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-base-200"
          >
            <div class="flex items-center gap-2.5">
              <div class="p-2 bg-primary/10 text-primary rounded-lg">
                <i class="fa-solid fa-bolt"></i>
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
              <span>Paso {{ pasoActual }} de {{ totalPasos }}</span>
              <span class="text-base-content/30">•</span>
              <span class="text-primary font-semibold">{{ progreso }}% completado</span>
            </div>
          </div>

          <WorkflowStepper :fases="proyecto.fases" :estado="proyecto.estado" size="large" />
        </section>

        <!-- Paneles de contenido -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          <PanelReactivos :banco="banco" />
          <ListaMiembros :propietario="proyecto.propietario" />
          <!-- <PanelInformacion :banco="banco" /> -->
        </div>

        <HallazgosPanel :hallazgos="hallazgos" />
      </template>
    </main>
  </div>
</template>
