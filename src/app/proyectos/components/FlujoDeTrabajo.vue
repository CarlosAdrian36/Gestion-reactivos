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

const pasos = computed(() =>
  props.fases.map((fase) => ({
    nombre: fase.nombre,
    icono: ICONOS_FASE[fase.nombre] ?? 'fa-solid fa-circle',
    estado: getEstadoFase(fase),
    estadoTexto: fase.estado,
  })),
)
</script>

<template>
  <section class="card flex h-full min-h-72 flex-col border border-base-300 bg-base-100 md:min-h-0">
    <div class="flex h-full flex-1 flex-col overflow-hidden p-4 sm:p-5 short:p-3">
      <h2 class="text-center text-sm font-bold uppercase tracking-wider">Flujo de trabajo</h2>
      <!-- paso  -->
      <div class="mt-5 flex min-h-0 flex-1 items-center justify-center overflow-y-auto short:mt-2">
        <ol class="relative w-full max-w-xs">
          <div aria-hidden="true" class="absolute left-5 top-5 bottom-5 w-px bg-base-300"></div>

          <li
            v-for="paso in pasos"
            :key="paso.nombre"
            class="relative flex items-center gap-4 pb-8 last:pb-0"
            :aria-current="paso.estado === 'en_proceso' ? 'step' : undefined"
          >
            <span
              class="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full font-bold"
              :class="{
                'bg-success text-success-content shadow-lg shadow-success/30':
                  paso.estado === 'completada',
                'bg-primary text-primary-content shadow-lg shadow-primary/30':
                  paso.estado === 'en_proceso',
                'border border-base-300 bg-base-200 text-base-content/50':
                  paso.estado === 'pendiente',
              }"
            >
              <i :class="paso.icono"></i>
            </span>

            <div class="flex flex-col">
              <span
                class="text-sm font-bold"
                :class="{
                  'text-success': paso.estado === 'completada',
                  'text-primary': paso.estado === 'en_proceso',
                  'text-base-content/50': paso.estado === 'pendiente',
                }"
              >
                {{ paso.nombre }}
              </span>
              <span
                class="text-xs font-medium"
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
