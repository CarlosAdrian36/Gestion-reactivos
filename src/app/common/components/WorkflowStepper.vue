<script lang="ts" setup>
import { computed } from 'vue'

interface Props {
  currentStepIndex: number
  currentLabel: string
  currentStatus: string
  completed?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  completed: false,
})

const STEPS = [
  { id: 'construccion', label: 'Construccion', icon: 'fa-regular fa-helmet-safety' },
  { id: 'revision', label: 'Revision', icon: ' fa-regular fa-magnifying-glass' },
  { id: 'traduccion', label: 'Traduccion', icon: 'fa-regular fa-messages' },
  { id: 'rev_traduccion', label: 'Revision traduccion', icon: 'fa-regular fa-message-slash' },
  { id: 'finalizado', label: 'Finalizado', icon: ' fa-regular fa-flag' },
]

const progressWidth = computed(() => {
  if (props.completed) return '85%'
  return `${(props.currentStepIndex / 4) * 85}%`
})

function getStepState(idx: number): 'completed' | 'in_progress' | 'pending' {
  if (props.completed) return 'completed'
  if (idx < props.currentStepIndex) return 'completed'
  if (idx === props.currentStepIndex) return 'in_progress'
  return 'pending'
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
        v-for="(step, idx) in STEPS"
        :key="step.id"
        class="relative z-10 flex items-center justify-center"
        :title="step.label"
      >
        <div
          v-if="getStepState(idx) === 'completed'"
          class="flex items-center justify-center text-white rounded-full w-7 h-7 bg-emerald-500 border-2 border-emerald-500 shadow-sm"
        >
          <i :class="step.icon" class="text-xs"></i>
        </div>

        <div
          v-else-if="getStepState(idx) === 'in_progress'"
          class="flex items-center justify-center bg-white border-2 rounded-full w-7 h-7 border-blue-600 shadow-sm"
        >
          <i :class="step.icon" class="text-xs text-blue-600"></i>
        </div>

        <div
          v-else
          class="flex items-center justify-center bg-white border-2 rounded-full w-7 h-7 border-slate-300 shadow-sm"
        >
          <i :class="step.icon" class="text-xs text-slate-400"></i>
        </div>
      </div>
    </div>

    <span
      class="mt-1 text-xs font-semibold"
      :class="completed ? 'text-emerald-600' : 'text-blue-600'"
    >
      {{ currentLabel }} ({{ currentStatus }})
    </span>
  </div>
</template>
