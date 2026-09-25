<script lang="ts" setup>
import { computed } from 'vue'
import type { Fase, Estado } from '@/api/proyectos/interfaces/proyecto.interface'

interface Props {
  fases: Fase[]
  estado: Estado
  size?: 'compact' | 'large'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'compact',
})

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
const isLarge = computed(() => props.size === 'large')
const workflowStatus = computed(() => (isFinalizado.value ? 'Completada' : props.estado.nombre))

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

function getStepStateLabel(fase: Fase): string {
  const state = getStepState(fase)
  if (state === 'completed') return 'Completada'
  if (state === 'in_progress') return 'En proceso'
  return 'Pendiente'
}
</script>

<template>
  <div class="flex flex-col items-center w-full">
    <div class="relative flex items-center justify-between w-full py-2" :class="isLarge ? 'pb-16' : ''">
      <div
        class="absolute -translate-y-1/2 h-0.5 bg-slate-200"
        :class="isLarge ? 'top-5 left-14 right-14' : 'top-1/2 left-5 right-5'"
      />
      <div
        class="absolute -translate-y-1/2 h-0.5 bg-emerald-500 origin-left transition-transform duration-300"
        :class="isLarge ? 'top-5 left-14 right-14' : 'top-1/2 left-5 right-5'"
        :style="{ transform: `translateY(-50%) scaleX(${progressScale})` }"
      />

      <div
        v-for="(fase, idx) in workflowPhases"
        :key="idx"
        class="relative z-10 flex items-center"
        :class="isLarge ? 'w-28 h-20 flex-col justify-start gap-1' : 'w-10 h-10 justify-center'"
        :title="getStepLabel(fase)"
        :aria-current="getStepState(fase) === 'in_progress' ? 'step' : undefined"
      >
        <div
          v-if="getStepState(fase) === 'completed'"
          class="flex items-center justify-center text-white rounded-full bg-emerald-500 border-2 border-emerald-500 shadow-sm"
          :class="isLarge ? 'w-10 h-10' : 'w-7 h-7'"
        >
          <i :class="[getStepIcon(fase.nombre), isLarge ? 'text-sm' : 'text-xs']"></i>
        </div>

        <div
          v-else-if="getStepState(fase) === 'in_progress'"
          class="flex items-center justify-center bg-white border-2 rounded-full border-blue-600 shadow-md"
          :class="isLarge ? 'w-12 h-12 ring-4 ring-blue-100' : 'w-10 h-10'"
        >
          <i :class="[getStepIcon(fase.nombre), 'text-blue-600', isLarge ? 'text-base' : 'text-sm']"></i>
        </div>

        <div
          v-else
          class="flex items-center justify-center bg-white border-2 rounded-full border-slate-300 shadow-sm"
          :class="isLarge ? 'w-10 h-10' : 'w-7 h-7'"
        >
          <i :class="[getStepIcon(fase.nombre), 'text-slate-400', isLarge ? 'text-sm' : 'text-xs']"></i>
        </div>

        <template v-if="isLarge">
          <span class="text-xs font-semibold text-center leading-tight max-w-28">
            {{ fase.nombre }}
          </span>
          <span
            class="text-[10px] text-center leading-tight"
            :class="
              getStepState(fase) === 'completed'
                ? 'text-emerald-600'
                : getStepState(fase) === 'in_progress'
                  ? 'text-blue-600'
                  : 'text-slate-400'
            "
          >
            {{ getStepStateLabel(fase) }}
          </span>
        </template>
      </div>
    </div>

    <span
      class="mt-1 text-xs font-semibold"
      :class="isFinalizado ? 'text-emerald-600' : 'text-blue-600'"
    >
      <span v-if="isLarge">Fase actual: </span>{{ displayedPhase }}
      <span v-if="isLarge" class="font-normal text-base-content/60">({{ workflowStatus }})</span>
    </span>
  </div>
</template>
