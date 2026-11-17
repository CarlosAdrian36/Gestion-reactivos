<script setup lang="ts">
import type { Respuesta } from '@/api/bancos/interfaces/respuesta.interface'

/** Vista de respuestas para el tipo 3 (Verdadero / Falso). */
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
      <i class="fa-regular fa-toggle-on text-[14px]"></i>
      Respuestas
    </h3>
    <div v-if="props.cargando" class="skeleton h-14 w-full rounded-xl"></div>
    <p v-else-if="props.error" class="text-sm text-error">
      No se pudieron cargar las respuestas en {{ props.idioma ?? 'el idioma original' }}.
    </p>
    <div v-else-if="respuestasOrdenadas.length" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div v-for="r in respuestasOrdenadas" :key="r.idRespuesta">
        <div
          class="flex items-center gap-2 px-6 py-4 rounded-xl border"
          :class="
            r.esCorrecta
              ? 'border-success bg-success/10 text-success'
              : 'border-base-300 bg-base-200/50 text-base-content/70'
          "
        >
          <i :class="r.esCorrecta ? 'fa-solid fa-circle-check' : 'fa-regular fa-circle'"></i>
          <span class="font-semibold">{{ r.respuesta }}</span>
        </div>
      </div>
    </div>
    <p v-else class="text-sm text-base-content/40">Sin respuestas guardadas</p>
  </div>
</template>
