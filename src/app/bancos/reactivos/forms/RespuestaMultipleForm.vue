<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { z } from 'zod'
import { toast } from 'vue-sonner'
import FroalaEditor from '@/components/FroalaEditor.vue'
import { TIPO_REACTIVO, useGuardarReactivo, type OpcionForm } from '@/api/bancos/composable/useGuardarReactivo'
import type { Reactivo } from '@/api/bancos/interfaces/reactivo.interface'
import type { Respuesta } from '@/api/bancos/interfaces/respuesta.interface'

const props = defineProps<{
  reactivo?: Reactivo
  respuestas?: Respuesta[]
}>()

const route = useRoute()
const bancoId = route.params.id as string
const { guardarPregunta, guardarRespuestas, guardandoPregunta, guardandoRespuestas, isGuardando, guardarTodo } =
  useGuardarReactivo(bancoId, TIPO_REACTIVO.respuestaMultiple, props.reactivo?.idReactivo)

const pregunta = ref(props.reactivo?.descripcion ?? '')
const opciones = ref<OpcionForm[]>(
  props.respuestas && props.respuestas.length > 0
    ? props.respuestas.map((r) => ({
        idRespuesta: r.idRespuesta,
        texto: r.respuesta,
        correcta: r.esCorrecta,
      }))
    : [{ texto: '', correcta: false }, { texto: '', correcta: false }],
)

const opcionesSchema = z.array(
  z.object({
    texto: z.string().trim().min(1, 'La respuesta debe tener al menos 1 carácter'),
    correcta: z.boolean(),
  }),
)

const erroresOpciones = ref<string[]>([])

function agregarOpcion() {
  if (opciones.value.length < 6) {
    opciones.value.push({ texto: '', correcta: false })
  }
}

function quitarOpcion(index: number) {
  if (opciones.value.length > 2) {
    opciones.value.splice(index, 1)
    erroresOpciones.value.splice(index, 1)
  }
}

function guardarPreguntaForm() {
  if (!pregunta.value.trim()) {
    toast.error('La pregunta no puede estar vacía')
    return
  }
  guardarPregunta(pregunta.value)
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
  guardarRespuestas(
    result.data.map((o, i) => ({
      idRespuesta: opciones.value[i]?.idRespuesta,
      texto: o.texto,
      correcta: o.correcta,
    })),
    props.respuestas?.map((r) => r.idRespuesta) ?? [],
  )
}

function guardarTodoForm() {
  if (!pregunta.value.trim()) {
    toast.error('La pregunta no puede estar vacía')
    return
  }
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
  guardarTodo(
    pregunta.value,
    result.data.map((o, i) => ({
      idRespuesta: opciones.value[i]?.idRespuesta,
      texto: o.texto,
      correcta: o.correcta,
    })),
    props.respuestas?.map((r) => r.idRespuesta) ?? [],
  )
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
        <label
          class="btn btn-xs rounded-lg cursor-pointer select-none transition-colors shrink-0 min-w-20 justify-center"
          :class="
            opcion.correcta
              ? 'btn-success text-success-content border-success'
              : 'btn-outline border-base-300'
          "
        >
          <input v-model="opcion.correcta" type="checkbox" class="hidden" />
          Correcta
        </label>
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
          class="btn btn-ghost btn-xs text-error shrink-0"
          :class="opciones.length > 2 ? '' : 'invisible'"
          @click="quitarOpcion(index)"
        >
          <i class="fa-regular fa-trash"></i>
        </button>
      </div>
    </div>

    <div class="flex gap-3 pt-4">
      <button
        v-if="props.reactivo?.idReactivo"
        class="btn btn-primary"
        :disabled="isGuardando"
        @click="guardarTodoForm"
      >
        <span v-if="isGuardando" class="loading loading-spinner"></span>
        {{ isGuardando ? 'Guardando...' : 'Guardar' }}
      </button>
      <template v-else>
        <button class="btn btn-primary" :disabled="guardandoPregunta" @click="guardarPreguntaForm">
          <span v-if="guardandoPregunta" class="loading loading-spinner"></span>
          {{ guardandoPregunta ? 'Guardando...' : 'Guardar pregunta' }}
        </button>
        <button class="btn btn-primary" :disabled="guardandoRespuestas" @click="guardarRespuestaForm">
          <span v-if="guardandoRespuestas" class="loading loading-spinner"></span>
          {{ guardandoRespuestas ? 'Guardando...' : 'Guardar respuestas' }}
        </button>
      </template>
    </div>
  </div>
</template>
