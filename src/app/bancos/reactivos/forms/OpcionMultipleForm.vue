<script setup lang="ts">
import { ref } from 'vue'
import FroalaEditor from '@/components/FroalaEditor.vue'

const emit = defineEmits<{
  guardar: [data: Record<string, unknown>]
}>()

const pregunta = ref('')
const opciones = ref([
  { texto: '', correcta: false },
  { texto: '', correcta: false },
])

function agregarOpcion() {
  if (opciones.value.length < 26) {
    opciones.value.push({ texto: '', correcta: false })
  }
}

function quitarOpcion(index: number) {
  if (opciones.value.length > 2) {
    opciones.value.splice(index, 1)
    // if (!opciones.value.some((o) => o.correcta)) {
    //   opciones.value[0]!.correcta = true
    // }
  }
}

function seleccionarCorrecta(index: number) {
  const opcion = opciones.value[index]
  if (!opcion) return
  if (opcion.correcta) {
    opcion.correcta = false
    return
  }
  opciones.value.forEach((o, i) => (o.correcta = i === index))
}

function guardarPregunta() {
  emit('guardar', {
    pregunta: pregunta.value,
  })
}
function guardarRespuesta() {
  emit('guardar', {
    opciones: opciones.value.map((o) => ({ texto: o.texto, correcta: o.correcta })),
  })
}

const preguntaConfig = {
  toolbarButtons: [
    'bold',
    'italic',
    'underline',
    'paragraphFormat',
    'align',
    'formatOL',
    'formatUL',
    'undo',
    'redo',
  ],
  placeholderText: 'Escribe la pregunta aquí...',
  heightMin: 120,
}

const opcionConfig = {
  toolbarInline: false,

  toolbarButtons: ['bold', 'italic', 'underline', '|', 'undo', 'redo'],
  toolbarButtonsSM: ['bold', 'italic'],
  toolbarButtonsXS: ['bold'],

  placeholderText: 'Respuesta',

  heightMin: 80,
  heightMax: 120,

  toolbarSticky: false,
}
</script>

<template>
  <div class="space-y-2">
    <h2 class="text-2xl font-bold">Opción Múltiple</h2>

    <div>
      <label class="label font-semibold">Pregunta</label>
      <FroalaEditor v-model="pregunta" :config="preguntaConfig" />
      <div class="flex gap-3 pt-4">
        <button class="btn btn-primary" @click="guardarPregunta">Guardar</button>
      </div>
    </div>

    <div>
      <div class="flex items-center justify-between mb-2">
        <label class="label font-semibold">Respuestas</label>
        <button
          v-if="opciones.length < 26"
          class="btn btn-ghost btn-xs gap-1"
          @click="agregarOpcion"
        >
          <i class="fa-regular fa-plus"></i>
          Agregar opción
        </button>
      </div>

      <div v-for="(opcion, index) in opciones" :key="index" class="flex items-center gap-3 mb-2">
        <!-- <input type="radio" aria-label="Correcta" class="btn btn-dash btn-success" /> -->
        <input
          type="checkbox"
          :checked="opcion.correcta"
          class="btn btn-ghost btn-xs checkbox checkbox-primary"
          @change="seleccionarCorrecta(index)"
        />

        <div class="flex-1 min-w-0">
          <FroalaEditor
            v-model="opcion.texto"
            :config="{
              ...opcionConfig,
              placeholderText: `Opción ${String.fromCharCode(65 + index)}`,
            }"
          />
        </div>
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
      <button class="btn btn-primary" @click="guardarRespuesta">Guardar</button>
    </div>
  </div>
</template>
<style scoped></style>
