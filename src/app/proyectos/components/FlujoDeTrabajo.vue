<script setup lang="ts">
import { computed } from 'vue'
import type { Fase } from '@/api/proyectos/interfaces/proyecto.interface'

const props = defineProps<{
  fases: Fase[]
  orientacion?: 'auto' | 'horizontal' | 'vertical'
}>()

type EstadoFase = 'completada' | 'en_proceso' | 'pendiente'

const ICONOS_FASE: Record<string, string> = {
  Construcción: 'fa-solid fa-screwdriver-wrench',
  Revision: 'fa-solid fa-magnifying-glass',
  Traduccion: 'fa-solid fa-language',
  'Revision Traduccion': 'fa-solid fa-comments',
  Finalizado: 'fa-solid fa-flag',
}

function getEstadoFase(fase: Fase): EstadoFase {
  if (fase.estado === 'Completada') return 'completada'
  if (fase.estado === 'En proceso') return 'en_proceso'
  return 'pendiente'
}

const fasesProyecto = computed(() => props.fases.filter((fase) => fase.nombre !== 'Finalizado'))

const todasCompletadas = computed(
  () =>
    fasesProyecto.value.length > 0 &&
    fasesProyecto.value.every((fase) => fase.estado === 'Completada'),
)

const pasos = computed(() => [
  ...fasesProyecto.value.map((fase) => ({
    nombre: fase.nombre,
    icono: ICONOS_FASE[fase.nombre] ?? 'fa-solid fa-circle',
    estado: getEstadoFase(fase),
    estadoTexto: fase.estado,
  })),
  {
    nombre: 'Finalizado',
    icono: ICONOS_FASE.Finalizado ?? 'fa-solid fa-flag',
    estado: (todasCompletadas.value ? 'completada' : 'pendiente') as EstadoFase,
    estadoTexto: todasCompletadas.value ? 'Completada' : 'Pendiente',
  },
])

const esCompacto = computed(() => pasos.value.length <= 3)

const lineaHorizontal = computed(() => {
  const inset = 100 / (2 * Math.max(pasos.value.length, 1))
  return { left: `${inset}%`, right: `${inset}%` }
})
</script>

<template>
  <section
    class="workflow-card card flex h-full min-h-0 flex-col border border-base-300 bg-base-100"
  >
    <div class="flex min-h-0 flex-1 flex-col p-3 sm:p-4">
      <div class="flex items-center gap-2.5 border-b border-base-200 pb-4">
        <div class="rounded-lg bg-primary/10 p-2 text-primary">
          <i class="fa-regular fa-diagram-project"></i>
        </div>
        <h2 class="text-xs font-bold uppercase tracking-wider sm:text-sm">Flujo de trabajo</h2>
      </div>

      <div class="workflow-content mt-2 flex min-h-0 flex-1 justify-center sm:items-center">
        <ol
          class="relative flex"
          :class="[
            props.orientacion === 'auto'
              ? 'workflow-list-auto w-full flex-col items-stretch'
              : props.orientacion === 'horizontal'
                ? 'workflow-list-horizontal w-full flex-row items-start justify-between'
                : props.orientacion === 'vertical'
                  ? 'workflow-list-vertical h-full w-auto flex-col items-stretch'
                  : 'workflow-list-responsive w-full flex-row items-start justify-between sm:w-auto sm:flex-col sm:items-stretch',
            props.orientacion === 'auto' || props.orientacion === 'horizontal'
              ? ''
              : props.orientacion === 'vertical'
                ? esCompacto
                  ? 'justify-center gap-28'
                  : 'justify-between'
                : esCompacto
                  ? 'sm:justify-center sm:gap-28'
                  : 'sm:h-full sm:justify-between',
          ]"
        >
          <!-- Línea horizontal -->
          <div
            v-if="props.orientacion !== 'vertical'"
            aria-hidden="true"
            class="workflow-line-horizontal absolute h-0.5 rounded-full bg-base-300"
            :class="
              props.orientacion === 'auto'
                ? 'top-5 hidden'
                : props.orientacion === 'horizontal'
                  ? esCompacto
                    ? 'top-6'
                    : 'top-7'
                  : 'top-6 sm:hidden'
            "
            :style="lineaHorizontal"
          ></div>
          <!-- Línea vertical -->
          <div
            v-if="props.orientacion !== 'horizontal'"
            aria-hidden="true"
            class="workflow-line-vertical absolute w-0.5 rounded-full bg-base-300"
            :class="
              props.orientacion === 'auto'
                ? 'left-5 top-5 bottom-5'
                : props.orientacion === 'vertical'
                  ? esCompacto
                    ? 'left-6 top-6 bottom-6'
                    : 'left-7 top-7 bottom-7'
                  : esCompacto
                    ? 'hidden sm:left-6 sm:top-6 sm:bottom-6 sm:block'
                    : 'hidden sm:left-7 sm:top-7 sm:bottom-7 sm:block'
            "
          ></div>

          <li
            v-for="paso in pasos"
            :key="paso.nombre"
            class="workflow-step relative z-10 flex min-w-0"
            :class="
              props.orientacion === 'auto'
                ? 'workflow-step-auto flex-none flex-row items-center gap-3 text-left'
                : props.orientacion === 'horizontal'
                  ? 'flex-1 flex-col items-center gap-2 text-center'
                  : props.orientacion === 'vertical'
                    ? 'flex-none flex-row items-center gap-5 text-left'
                    : 'flex-1 flex-col items-center gap-2 text-center sm:flex-none sm:flex-row sm:gap-5 sm:text-left'
            "
            :aria-current="paso.estado === 'en_proceso' ? 'step' : undefined"
          >
            <span
              class="workflow-icon flex size-12 shrink-0 items-center justify-center rounded-full text-lg font-bold"
              :class="[
                esCompacto ? 'sm:size-12 sm:text-lg' : 'sm:size-14 sm:text-xl',
                {
                  'bg-success text-success-content shadow-lg shadow-success/30':
                    paso.estado === 'completada',
                  'bg-primary text-primary-content shadow-lg shadow-primary/30':
                    paso.estado === 'en_proceso',
                  'border border-base-300 bg-base-200 text-base-content/50':
                    paso.estado === 'pendiente',
                },
              ]"
            >
              <i :class="paso.icono"></i>
            </span>

            <div class="workflow-copy flex min-w-0 flex-col">
              <span
                class="workflow-name text-xs font-bold sm:text-base"
                :class="{
                  'text-success': paso.estado === 'completada',
                  'text-primary': paso.estado === 'en_proceso',
                  'text-base-content/50': paso.estado === 'pendiente',
                }"
              >
                {{ paso.nombre }}
              </span>
              <span
                class="workflow-status text-[11px] font-medium sm:text-sm"
                :class="{
                  'text-success': paso.estado === 'completada',
                  'text-primary': paso.estado === 'en_proceso',
                  'text-base-content/50': paso.estado === 'pendiente',
                }"
              >
                {{ paso.estadoTexto }}
              </span>
            </div>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>

<style scoped>
.workflow-card {
  container: workflow / inline-size;
}

.workflow-list-auto {
  gap: 0.375rem;
}

.workflow-list-auto .workflow-step-auto {
  flex-direction: row;
  align-items: center;
  gap: 0.75rem;
  text-align: left;
}

.workflow-list-auto .workflow-icon {
  width: 2.5rem;
  height: 2.5rem;
  font-size: 1rem;
}

.workflow-list-auto .workflow-name {
  font-size: 0.75rem;
  line-height: 1rem;
}

.workflow-list-auto .workflow-status {
  font-size: 0.6875rem;
  line-height: 0.875rem;
}

.workflow-list-auto .workflow-line-horizontal {
  display: none;
}

.workflow-list-auto .workflow-line-vertical {
  display: block;
  left: 1.25rem;
  top: 1.25rem;
  bottom: 1.25rem;
}

@container workflow (min-width: 42rem) {
  .workflow-list-auto {
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0;
  }

  .workflow-list-auto .workflow-step-auto {
    flex: 1 1 0%;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    text-align: center;
  }

  .workflow-list-auto .workflow-copy {
    align-items: center;
  }

  .workflow-list-auto .workflow-line-horizontal {
    display: block;
    top: 1.25rem;
  }

  .workflow-list-auto .workflow-line-vertical {
    display: none;
  }
}
</style>
