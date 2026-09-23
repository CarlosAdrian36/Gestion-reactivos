<script lang="ts" setup>
import { computed } from 'vue'
import type { Fase, Estado } from '@/api/proyectos/interfaces/proyecto.interface'

interface Props {
  fases: Fase[]
  estado: Estado
}

const props = defineProps<Props>()

const STEPS_CONFIG = [
  { nombre: 'Construcción', icon: 'fa-solid fa-screwdriver-wrench' },
  { nombre: 'Revision', icon: 'fa-solid fa-magnifying-glass' },
  { nombre: 'Traduccion', icon: 'fa-solid fa-language' },
  { nombre: 'Revision Traduccion', icon: 'fa-solid fa-comments' },
  { nombre: 'Finalizado', icon: 'fa-solid fa-flag' },
]

const projectPhases = computed(() => props.fases.filter((fase) => fase.nombre !== 'Finalizado'))

const allPhasesCompleted = computed(
  () =>
    projectPhases.value.length > 0 &&
    projectPhases.value.every((fase) => fase.estado === 'Completada'),
)

const isFinalizado = computed(() => allPhasesCompleted.value)

const workflowPhases = computed<Fase[]>(() => [
  ...projectPhases.value,
  {
    nombre: 'Finalizado',
    funcion: null,
    estado: allPhasesCompleted.value ? 'Completada' : 'Pendiente',
  },
])

const currentPhaseIndex = computed(() => {
  if (isFinalizado.value) return workflowPhases.value.length - 1

  const inProgressIndex = projectPhases.value.findIndex((f) => f.estado === 'En proceso')
  if (inProgressIndex !== -1) return inProgressIndex

  const firstPendingIndex = projectPhases.value.findIndex((f) => f.estado !== 'Completada')
  return firstPendingIndex
})

const currentPhase = computed(() => workflowPhases.value[currentPhaseIndex.value])

const progressScale = computed(() => {
  const lastIndex = workflowPhases.value.length - 1
  if (isFinalizado.value) return 1
  if (lastIndex <= 0) return 0
  if (currentPhaseIndex.value < 0) return 0
  return currentPhaseIndex.value / lastIndex
})

const displayedPhase = computed(
  () =>
    currentPhase.value?.nombre ||
    projectPhases.value[projectPhases.value.length - 1]?.nombre ||
    'Sin fase',
)

function getStepState(fase: Fase): 'completed' | 'in_progress' | 'pending' {
  if (fase.nombre === 'Finalizado') {
    return allPhasesCompleted.value ? 'completed' : 'pending'
  }
  if (fase.estado === 'Completada') return 'completed'
  if (fase === currentPhase.value) return 'in_progress'
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
      <div class="absolute top-1/2 left-5 right-5 -translate-y-1/2 h-0.5 bg-slate-200" />
      <div
        class="absolute top-1/2 left-5 right-5 -translate-y-1/2 h-0.5 bg-emerald-500 origin-left transition-transform duration-300"
        :style="{ transform: `translateY(-50%) scaleX(${progressScale})` }"
      />

      <div
        v-for="(fase, idx) in workflowPhases"
        :key="idx"
        class="relative z-10 flex items-center justify-center w-10 h-10"
        :title="getStepLabel(fase)"
        :aria-current="getStepState(fase) === 'in_progress' ? 'step' : undefined"
      >
        <div
          v-if="getStepState(fase) === 'completed'"
          class="flex items-center justify-center text-white rounded-full w-7 h-7 bg-emerald-500 border-2 border-emerald-500 shadow-sm"
        >
          <i :class="getStepIcon(fase.nombre)" class="text-xs"></i>
        </div>

        <div
          v-else-if="getStepState(fase) === 'in_progress'"
          class="flex items-center justify-center bg-white border-2 rounded-full w-10 h-10 border-blue-600 ring-4 ring-blue-100 shadow-md"
        >
          <i :class="getStepIcon(fase.nombre)" class="text-sm text-blue-600"></i>
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
      {{ displayedPhase }}
    </span>
  </div>
</template>
