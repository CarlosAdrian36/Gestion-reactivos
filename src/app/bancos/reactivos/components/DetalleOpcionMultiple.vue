<script setup lang="ts">
import type { Respuesta } from '@/api/bancos/interfaces/respuesta.interface'

/** Vista de respuestas para tipos 1 (Opción Múltiple) y 2 (Respuesta Múltiple). */
const props = defineProps<{
  /** Respuestas del reactivo; el componente las ordena por posición. */
  respuestas: Respuesta[]
  cargando: boolean
  error: boolean
  idioma?: string
}>()

import { computed } from 'vue'

const respuestasOrdenadas = computed(() =>
  [...props.respuestas].sort((a, b) => a.posicion - b.posicion),
)
</script>

<template>
  <div class="space-y-3">
    <h3
      class="text-xs font-bold uppercase tracking-wider text-base-content/60 flex items-center gap-2"
    >
      <i class="fa-regular fa-list-check text-[14px]"></i>
      Respuestas
    </h3>
    <div v-if="props.cargando" class="space-y-2">
      <div class="skeleton h-12 w-full rounded-xl"></div>
      <div class="skeleton h-12 w-full rounded-xl"></div>
    </div>
    <p v-else-if="props.error" class="text-sm text-error">
      No se pudieron cargar las respuestas en {{ props.idioma ?? 'el idioma original' }}.
    </p>
    <div v-else-if="respuestasOrdenadas.length" class="space-y-2">
      <div v-for="(r, i) in respuestasOrdenadas" :key="r.idRespuesta">
        <div
          class="flex items-center gap-3 p-4 rounded-xl border"
          :class="r.esCorrecta ? 'border-success bg-success/10' : 'border-base-300 bg-base-200/50'"
        >
          <span
            class="size-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
            :class="
              r.esCorrecta ? 'bg-success text-success-content' : 'bg-base-300 text-base-content/60'
            "
          >
            {{ r.esCorrecta ? '✓' : String.fromCharCode(65 + i) }}
          </span>
          <div
            class="fr-view min-w-0 flex-1 text-sm text-base-content leading-relaxed [&_p]:m-0"
            v-html="r.respuesta"
          ></div>
        </div>
      </div>
    </div>
    <p v-else class="text-sm text-base-content/40">Sin respuestas guardadas</p>
  </div>
</template>
