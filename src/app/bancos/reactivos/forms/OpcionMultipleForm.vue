<script setup lang="ts">
import { ref } from 'vue'
import { z } from 'zod'
import { toast } from 'vue-sonner'
import FroalaEditor from '@/components/FroalaEditor.vue'

const props = defineProps<{
  guardandoPregunta?: boolean
  guardandoRespuestas?: boolean
}>()

const emit = defineEmits<{
  guardar: [data: Record<string, unknown>]
}>()

const pregunta = ref('')
const opciones = ref([
  { texto: '', correcta: false },
  { texto: '', correcta: false },
])

const opcionesSchema = z.array(
  z.object({
    texto: z.string().trim().min(1, 'La respuesta debe tener al menos 1 carácter'),
    correcta: z.boolean(),
  }),
)

const erroresOpciones = ref<string[]>([])

function agregarOpcion() {
  if (opciones.value.length < 26) {
    opciones.value.push({ texto: '', correcta: false })
  }
}

function quitarOpcion(index: number) {
  if (opciones.value.length > 2) {
    opciones.value.splice(index, 1)
    erroresOpciones.value.splice(index, 1)
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
  const result = opcionesSchema.safeParse(opciones.value)
  if (!result.success) {
    const errores = opciones.value.map(() => '')
    for (const issue of result.error.issues) {
      const idx = issue.path[0] as number
      errores[idx] = issue.message
    }
    erroresOpciones.value = errores
    toast.error('Cada respuesta debe tener al menos 1 carácter')
    return
  }
  erroresOpciones.value = []
  emit('guardar', {
    opciones: result.data.map((o) => ({ texto: o.texto, correcta: o.correcta })),
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
        <button
          class="btn btn-primary"
          :disabled="props.guardandoPregunta"
          @click="guardarPregunta"
        >
          <span v-if="props.guardandoPregunta" class="loading loading-spinner"></span>
          {{ props.guardandoPregunta ? 'Guardando...' : 'Guardar' }}
        </button>
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
          <p v-if="erroresOpciones[index]" class="text-error text-xs mt-1">
            {{ erroresOpciones[index] }}
          </p>
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
      <button
        class="btn btn-primary"
        :disabled="props.guardandoRespuestas"
        @click="guardarRespuesta"
      >
        <span v-if="props.guardandoRespuestas" class="loading loading-spinner"></span>
        {{ props.guardandoRespuestas ? 'Guardando...' : 'Guardar' }}
      </button>
    </div>
  </div>
</template>
<style scoped></style>
