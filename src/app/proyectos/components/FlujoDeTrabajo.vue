<script setup lang="ts">
import { computed } from 'vue'
import type { Fase } from '@/api/proyectos/interfaces/proyecto.interface'

const props = defineProps<{
  fases: Fase[]
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
  <section class="card flex h-full min-h-72 flex-col border border-base-300 bg-base-100 md:min-h-0">
    <div class="flex h-full flex-1 flex-col overflow-hidden p-4 sm:p-6 short:p-3">
      <h2 class="text-center text-sm font-bold uppercase tracking-wider sm:text-base">
        Flujo de trabajo
      </h2>

      <div class="mt-5 flex min-h-0 flex-1 justify-center overflow-hidden sm:items-center short:mt-2">
        <ol
          class="relative flex w-full flex-row items-start justify-between sm:w-auto sm:flex-col sm:items-stretch"
          :class="esCompacto ? 'sm:justify-center sm:gap-28' : 'sm:h-full sm:justify-between'"
        >
          <!-- Línea horizontal (teléfono) -->
          <div
            aria-hidden="true"
            class="absolute top-6 h-0.5 rounded-full bg-base-300 sm:hidden"
            :style="lineaHorizontal"
          ></div>
          <!-- Línea vertical (sm en adelante) -->
          <div
            aria-hidden="true"
            class="absolute hidden w-0.5 rounded-full bg-base-300 sm:block"
            :class="
              esCompacto ? 'sm:left-6 sm:top-6 sm:bottom-6' : 'sm:left-7 sm:top-7 sm:bottom-7'
            "
          ></div>

          <li
            v-for="paso in pasos"
            :key="paso.nombre"
            class="relative z-10 flex min-w-0 flex-1 flex-col items-center gap-2 text-center sm:flex-none sm:flex-row sm:gap-5 sm:text-left"
            :aria-current="paso.estado === 'en_proceso' ? 'step' : undefined"
          >
            <span
              class="flex size-12 shrink-0 items-center justify-center rounded-full text-lg font-bold"
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

            <div class="flex min-w-0 flex-col">
              <span
                class="text-xs font-bold sm:text-base"
                :class="{
                  'text-success': paso.estado === 'completada',
                  'text-primary': paso.estado === 'en_proceso',
                  'text-base-content/50': paso.estado === 'pendiente',
                }"
              >
                {{ paso.nombre }}
              </span>
              <span
                class="text-[11px] font-medium sm:text-sm"
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
