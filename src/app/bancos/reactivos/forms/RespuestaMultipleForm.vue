<script setup lang="ts">
import { ref } from 'vue'
import FroalaEditor from '@/components/FroalaEditor.vue'

const emit = defineEmits<{
  guardar: [data: Record<string, unknown>]
}>()

const pregunta = ref('')
const opciones = ref([{ texto: '', correcta: false }, { texto: '', correcta: false }])

function agregarOpcion() {
  if (opciones.value.length < 6) {
    opciones.value.push({ texto: '', correcta: false })
  }
}

function quitarOpcion(index: number) {
  if (opciones.value.length > 2) {
    opciones.value.splice(index, 1)
  }
}

function guardar() {
  emit('guardar', {
    pregunta: pregunta.value,
    opciones: opciones.value.map(o => ({ texto: o.texto, correcta: o.correcta })),
  })
}
</script>

<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold">Respuesta Múltiple</h2>

    <div>
      <label class="label font-semibold">Pregunta</label>
      <FroalaEditor v-model="pregunta" :config="{
        toolbarButtons: ['bold', 'italic', 'underline', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'undo', 'redo'],
        placeholderText: 'Escribe la pregunta aquí...',
        heightMin: 120,
      }" />
    </div>

    <div>
      <div class="flex items-center justify-between mb-2">
        <label class="label font-semibold">Opciones</label>
        <button
          v-if="opciones.length < 6"
          class="btn btn-ghost btn-xs gap-1"
          @click="agregarOpcion"
        >
          <i class="fa-regular fa-plus"></i>
          Agregar opción
        </button>
      </div>

      <div
        v-for="(opcion, index) in opciones"
        :key="index"
        class="flex items-center gap-3 mb-2"
      >
        <input
          v-model="opcion.correcta"
          type="checkbox"
          class="checkbox checkbox-primary checkbox-sm"
        />
        <input
          v-model="opcion.texto"
          type="text"
          class="input input-bordered input-sm flex-1"
          :placeholder="`Opción ${String.fromCharCode(65 + index)}`"
        />
        <button
          v-if="opciones.length > 2"
          class="btn btn-ghost btn-xs text-error"
          @click="quitarOpcion(index)"
        >
          <i class="fa-regular fa-trash"></i>
        </button>
      </div>
    </div>

    <div class="flex gap-3 pt-4">
      <button class="btn btn-primary" @click="guardar">Guardar</button>
    </div>
  </div>
</template>
