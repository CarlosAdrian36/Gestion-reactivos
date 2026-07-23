<script setup lang="ts">
import { ref } from 'vue'
import FroalaEditor from '@/components/FroalaEditor.vue'

const emit = defineEmits<{
  guardar: [data: Record<string, unknown>]
}>()

const pregunta = ref('')
const respuestaModelo = ref('')

function guardar() {
  emit('guardar', {
    pregunta: pregunta.value,
    respuestaModelo: respuestaModelo.value,
  })
}
</script>

<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold">Pregunta Abierta</h2>

    <div>
      <label class="label font-semibold">Pregunta</label>
      <FroalaEditor v-model="pregunta" :config="{
        toolbarButtons: ['bold', 'italic', 'underline', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'undo', 'redo'],
        placeholderText: 'Escribe la pregunta aquí...',
        heightMin: 120,
      }" />
    </div>

    <div>
      <label class="label font-semibold">
        Respuesta modelo
        <span class="text-base-content/40 text-xs font-normal">(opcional)</span>
      </label>
      <FroalaEditor v-model="respuestaModelo" :config="{
        toolbarButtons: ['bold', 'italic', 'underline', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'undo', 'redo'],
        placeholderText: 'Escribe una respuesta de referencia...',
        heightMin: 120,
      }" />
    </div>

    <div class="flex gap-3 pt-4">
      <button class="btn btn-primary" @click="guardar">Guardar</button>
    </div>
  </div>
</template>
