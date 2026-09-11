<script lang="ts" setup>
import { computed } from 'vue'
import type { Fase, Estado } from '@/api/proyectos/interfaces/proyecto.interface'

interface Props {
  fases: Fase[]
  estado: Estado
}

const props = defineProps<Props>()

const STEPS_CONFIG = [
  { nombre: 'Construccion', icon: 'fa-solid fa-helmet-safety' },
  { nombre: 'Revision', icon: 'fa-solid fa-magnifying-glass' },
  { nombre: 'Traduccion', icon: 'fa-solid fa-language' },
  { nombre: 'Revision traduccion', icon: 'fa-solid fa-comments' },
  { nombre: 'Finalizado', icon: 'fa-solid fa-flag' },
]

const isFinalizado = computed(() => props.estado.nombre === 'Completada')

const progressWidth = computed(() => {
  if (isFinalizado.value) return '85%'
  const lastIndex = props.fases.length - 1
  const currentIdx = props.fases.findIndex((f) => f.estado === 'En proceso')
  if (currentIdx === -1) return '0%'
  return `${(currentIdx / lastIndex) * 85}%`
})

function getStepState(fase: Fase): 'completed' | 'in_progress' | 'pending' {
  if (isFinalizado.value) return 'completed'
  if (fase.estado === 'Completada') return 'completed'
  if (fase.estado === 'En proceso') return 'in_progress'
  return 'pending'
}

function getStepIcon(stepNombre: string): string {
  const config = STEPS_CONFIG.find((s) => s.nombre === stepNombre)
  return config?.icon || ''
}

function getStepLabel(fase: Fase): string {
  return `${fase.nombre} (${fase.estado})`
}
</script>

<template>
  <div class="flex flex-col items-center w-full">
    <div class="relative flex items-center justify-between w-full py-2">
      <div class="absolute top-1/2 left-3 right-3 -translate-y-1/2 h-0.5 bg-slate-200" />
      <div
        class="absolute top-1/2 left-3 -translate-y-1/2 h-0.5 bg-emerald-500 transition-all duration-300"
        :style="{ width: progressWidth }"
      />

      <div
        v-for="(fase, idx) in fases"
        :key="idx"
        class="relative z-10 flex items-center justify-center"
        :title="getStepLabel(fase)"
      >
        <div
          v-if="getStepState(fase) === 'completed'"
          class="flex items-center justify-center text-white rounded-full w-7 h-7 bg-emerald-500 border-2 border-emerald-500 shadow-sm"
        >
          <i :class="getStepIcon(fase.nombre)" class="text-xs"></i>
        </div>

        <div
          v-else-if="getStepState(fase) === 'in_progress'"
          class="flex items-center justify-center bg-white border-2 rounded-full w-7 h-7 border-blue-600 shadow-sm"
        >
          <i :class="getStepIcon(fase.nombre)" class="text-xs text-blue-600"></i>
        </div>

        <div
          v-else
          class="flex items-center justify-center bg-white border-2 rounded-full w-7 h-7 border-slate-300 shadow-sm"
        >
          <i :class="getStepIcon(fase.nombre)" class="text-xs text-slate-400"></i>
        </div>
      </div>
    </div>

    <span
      class="mt-1 text-xs font-semibold"
      :class="isFinalizado ? 'text-emerald-600' : 'text-blue-600'"
    >
      {{ fases.find((f) => f.estado === 'En proceso')?.nombre || fases[fases.length - 1]?.nombre }}
      ({{ estado.nombre }})
    </span>
  </div>
</template>
