<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { z } from 'zod'
import { toast } from 'vue-sonner'
import FroalaEditor from '@/components/FroalaEditor.vue'
import { TIPO_REACTIVO, useGuardarReactivo } from '@/api/bancos/composable/useGuardarReactivo'

const route = useRoute()
const bancoId = route.params.id as string
const { guardarPregunta, guardarRespuestas, guardandoPregunta, guardandoRespuestas } =
  useGuardarReactivo(bancoId, TIPO_REACTIVO.opcionMultiple)

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

function guardarPreguntaForm() {
  if (!pregunta.value.trim()) {
    toast.error('La pregunta no puede estar vacía')
    return
  }
  guardarPregunta(pregunta.value)
}

function guardarRespuestaForm() {
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
  guardarRespuestas(result.data.map((o) => ({ texto: o.texto, correcta: o.correcta })))
}

const preguntaConfig = {
  quickInsertEnabled: false,
  toolbarButtons: [
    'bold',
    'italic',
    'underline',
    '|',
    'fontFamily',
    'fontSize',
    '|', // Botones para Tipografía y Tamaño
    'textColor',
    'backgroundColor', // Botones para Colores
    '|',
    'alignLeft',
    'alignCenter',
    'alignRight',
    '|',
    'insertTable',
    '|',
    'outdent',
    'indent',
    '|',
    'formatOL',
    'formatUL',
    '|',
    'clearFormatting',
    '|',
    'undo',
    'redo',
  ],
  placeholderText: 'Escribe la pregunta aquí...',
  heightMin: 120,
  charCounterCount: true,
  // pasteDeniedAttrs: ['style', 'class', 'id'], // Elimina atributos en línea como background-color, color, font-family
  // pasteDeniedTags: ['span', 'font'], // Elimina etiquetas típicas que arrastran fuentes/colores

  wordPasteFormat: 'keep', // Opciones: 'clean' (limpio), 'formatted' (mantiene estilos), 'keep'
  wordPasteKeepFormatting: true,
}

const opcionConfig = {
  toolbarInline: false,

  toolbarButtons: ['bold', 'italic', 'underline', '|', 'undo', 'redo'],
  toolbarButtonsSM: ['bold', 'italic'],
  toolbarButtonsXS: ['bold'],

  placeholderText: 'Respuesta',

  heightMin: 80,
  heightMax: 120,
  quickInsertEnabled: false,
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
        <button class="btn btn-primary" :disabled="guardandoPregunta" @click="guardarPreguntaForm">
          <span v-if="guardandoPregunta" class="loading loading-spinner"></span>
          {{ guardandoPregunta ? 'Guardando...' : 'Guardar pregunta' }}
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
      <button class="btn btn-primary" :disabled="guardandoRespuestas" @click="guardarRespuestaForm">
        <span v-if="guardandoRespuestas" class="loading loading-spinner"></span>
        {{ guardandoRespuestas ? 'Guardando...' : 'Guardar respuestas' }}
      </button>
    </div>
  </div>
</template>
<style scoped></style>
