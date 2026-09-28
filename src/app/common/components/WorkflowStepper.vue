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

function getStateLabelClass(state: 'completed' | 'in_progress' | 'pending'): string {
  if (state === 'completed')
    return 'inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-success/15 text-success'
  if (state === 'in_progress')
    return 'inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-primary/15 text-primary'
  return 'text-[11px] font-normal text-base-content/40'
}
</script>

<template>
  <div class="flex flex-col items-center w-full">
    <div
      class="relative flex w-full justify-between"
      :class="isLarge ? 'items-start' : 'items-center py-2'"
    >
      <!-- Línea base de progreso -->
      <div
        aria-hidden="true"
        class="absolute -translate-y-1/2 rounded-full bg-base-200"
        :class="isLarge ? 'left-14 right-14 top-6 h-1' : 'left-5 right-5 top-1/2 h-0.5'"
      />
      <!-- Línea de avance -->
      <div
        aria-hidden="true"
        class="absolute -translate-y-1/2 rounded-full bg-success origin-left transition-transform duration-300"
        :class="isLarge ? 'left-14 right-14 top-6 h-1' : 'left-5 right-5 top-1/2 h-0.5'"
        :style="{ transform: `translateY(-50%) scaleX(${progressScale})` }"
      />

      <div
        v-for="(fase, idx) in workflowPhases"
        :key="idx"
        class="relative z-10 flex items-center group"
        :class="isLarge ? 'w-28 flex-col justify-start' : 'w-10 h-10 justify-center'"
        :title="getStepLabel(fase)"
        :aria-current="getStepState(fase) === 'in_progress' ? 'step' : undefined"
      >
        <template v-if="isLarge">
          <!-- Nodo completado -->
          <div
            v-if="getStepState(fase) === 'completed'"
            class="flex h-12 w-12 items-center justify-center rounded-2xl bg-success text-success-content shadow-sm"
          >
            <i :class="[getStepIcon(fase.nombre), 'text-base']"></i>
          </div>

          <!-- Nodo en proceso -->
          <div
            v-else-if="getStepState(fase) === 'in_progress'"
            class="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-content shadow-md shadow-primary/25 ring-4 ring-primary/10 transition transform hover:scale-105"
          >
            <i :class="[getStepIcon(fase.nombre), 'text-base']"></i>
          </div>

          <!-- Nodo pendiente -->
          <div
            v-else
            class="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-base-300 bg-base-100 text-base-content/40 transition group-hover:border-base-content/25"
          >
            <i :class="[getStepIcon(fase.nombre), 'text-base']"></i>
          </div>

          <span
            class="mt-3 text-xs sm:text-sm font-bold text-center leading-tight max-w-28"
            :class="
              getStepState(fase) === 'completed'
                ? 'text-success'
                : getStepState(fase) === 'in_progress'
                  ? 'text-primary'
                  : 'text-base-content/80 font-medium'
            "
          >
            {{ fase.nombre }}
          </span>
          <span
            class="mt-1 text-center leading-tight"
            :class="getStateLabelClass(getStepState(fase))"
          >
            {{ getStepStateLabel(fase) }}
          </span>
        </template>

        <template v-else>
          <div
            v-if="getStepState(fase) === 'completed'"
            class="flex items-center justify-center text-white rounded-full bg-emerald-500 border-2 border-emerald-500 shadow-sm w-7 h-7"
          >
            <i :class="[getStepIcon(fase.nombre), 'text-xs']"></i>
          </div>

          <div
            v-else-if="getStepState(fase) === 'in_progress'"
            class="flex items-center justify-center bg-white border-2 rounded-full border-blue-600 shadow-md w-10 h-10"
          >
            <i :class="[getStepIcon(fase.nombre), 'text-blue-600', 'text-sm']"></i>
          </div>

          <div
            v-else
            class="flex items-center justify-center bg-white border-2 rounded-full border-slate-300 shadow-sm w-7 h-7"
          >
            <i :class="[getStepIcon(fase.nombre), 'text-slate-400', 'text-xs']"></i>
          </div>
        </template>
      </div>
    </div>

    <!-- Contexto de fase actual -->
    <div
      v-if="isLarge"
      class="mt-2 w-full pt-4 border-t border-base-200 flex items-center justify-center text-xs sm:text-sm text-base-content/70 font-medium"
    >
      <span>Fase actual:&nbsp;</span>
      <strong class="font-semibold" :class="isFinalizado ? 'text-success' : 'text-primary'">
        {{ displayedPhase }}
      </strong>
      <span>&nbsp;({{ workflowStatus }})</span>
    </div>
    <span
      v-else
      class="mt-1 text-xs font-semibold"
      :class="isFinalizado ? 'text-emerald-600' : 'text-blue-600'"
    >
      {{ displayedPhase }}
    </span>
  </div>
</template>
