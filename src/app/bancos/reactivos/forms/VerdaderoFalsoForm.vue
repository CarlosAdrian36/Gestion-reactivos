<script setup lang="ts">
import { ref } from 'vue'
import FroalaEditor from '@/components/FroalaEditor.vue'

const emit = defineEmits<{
  guardar: [data: Record<string, unknown>]
}>()

const pregunta = ref('')
const respuestaCorrecta = ref<boolean | null>(null)

function guardar() {
  emit('guardar', {
    pregunta: pregunta.value,
    respuestaCorrecta: respuestaCorrecta.value,
  })
}
</script>

<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold">Verdadero / Falso</h2>

    <div>
      <label class="label font-semibold">Afirmación</label>
      <FroalaEditor v-model="pregunta" :config="{
        toolbarButtons: ['bold', 'italic', 'underline', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'undo', 'redo'],
        placeholderText: 'Escribe la afirmación aquí...',
        heightMin: 120,
      }" />
    </div>

    <div>
      <label class="label font-semibold">Respuesta correcta</label>
      <div class="flex gap-4">
        <label
          class="flex items-center gap-2 px-6 py-3 rounded-xl border cursor-pointer transition-all"
          :class="respuestaCorrecta === true ? 'border-success bg-success/10 text-success' : 'border-base-300'"
        >
          <input
            type="radio"
            :checked="respuestaCorrecta === true"
            class="radio radio-success radio-sm"
            @change="respuestaCorrecta = true"
          />
          Verdadero
        </label>
        <label
          class="flex items-center gap-2 px-6 py-3 rounded-xl border cursor-pointer transition-all"
          :class="respuestaCorrecta === false ? 'border-error bg-error/10 text-error' : 'border-base-300'"
        >
          <input
            type="radio"
            :checked="respuestaCorrecta === false"
            class="radio radio-error radio-sm"
            @change="respuestaCorrecta = false"
          />
          Falso
        </label>
      </div>
    </div>

    <div class="flex gap-3 pt-4">
      <button class="btn btn-primary" :disabled="respuestaCorrecta === null" @click="guardar">Guardar</button>
    </div>
  </div>
</template>
