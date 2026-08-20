<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { toast } from 'vue-sonner'
import FroalaEditor from '@/components/FroalaEditor.vue'
import { TIPO_REACTIVO, useGuardarReactivo } from '@/api/bancos/composable/useGuardarReactivo'
import type { Reactivo } from '@/api/bancos/interfaces/reactivo.interface'
import type { Respuesta } from '@/api/bancos/interfaces/respuesta.interface'

const props = defineProps<{
  reactivo?: Reactivo
  respuestas?: Respuesta[]
}>()

const route = useRoute()
const bancoId = route.params.id as string
const { guardarPregunta, guardarRespuestas, guardandoPregunta, guardandoRespuestas, isGuardando, guardarTodo } =
  useGuardarReactivo(bancoId, TIPO_REACTIVO.verdaderoFalso, props.reactivo?.idReactivo)

const pregunta = ref(props.reactivo?.descripcion ?? '')

function calcularCorrecta(respuestas?: Respuesta[]): boolean | null {
  if (!respuestas?.length) return null
  const correcta = respuestas.find((r) => r.esCorrecta)
  if (!correcta) return null
  return correcta.respuesta.trim().toLowerCase() === 'verdadero'
}

const respuestaCorrecta = ref<boolean | null>(calcularCorrecta(props.respuestas))

function guardarPreguntaForm() {
  if (!pregunta.value.trim()) {
    toast.error('La afirmación no puede estar vacía')
    return
  }
  guardarPregunta(pregunta.value)
}

function guardarRespuestaForm() {
  if (respuestaCorrecta.value === null) return
  const idVerdadero = props.respuestas?.find(
    (r) => r.respuesta.trim().toLowerCase() === 'verdadero',
  )?.idRespuesta
  const idFalso = props.respuestas?.find(
    (r) => r.respuesta.trim().toLowerCase() === 'falso',
  )?.idRespuesta
  guardarRespuestas(
    [
      { idRespuesta: idVerdadero, texto: 'Verdadero', correcta: respuestaCorrecta.value === true },
      { idRespuesta: idFalso, texto: 'Falso', correcta: respuestaCorrecta.value === false },
    ],
    props.respuestas?.map((r) => r.idRespuesta) ?? [],
  )
}

function guardarTodoForm() {
  if (!pregunta.value.trim()) {
    toast.error('La afirmación no puede estar vacía')
    return
  }
  if (respuestaCorrecta.value === null) {
    toast.error('Selecciona la respuesta correcta')
    return
  }
  const idVerdadero = props.respuestas?.find(
    (r) => r.respuesta.trim().toLowerCase() === 'verdadero',
  )?.idRespuesta
  const idFalso = props.respuestas?.find(
    (r) => r.respuesta.trim().toLowerCase() === 'falso',
  )?.idRespuesta
  guardarTodo(
    pregunta.value,
    [
      { idRespuesta: idVerdadero, texto: 'Verdadero', correcta: respuestaCorrecta.value === true },
      { idRespuesta: idFalso, texto: 'Falso', correcta: respuestaCorrecta.value === false },
    ],
    props.respuestas?.map((r) => r.idRespuesta) ?? [],
  )
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
        <button
          class="btn btn-primary"
          :disabled="respuestaCorrecta === null || guardandoRespuestas"
          @click="guardarRespuestaForm"
        >
          <span v-if="guardandoRespuestas" class="loading loading-spinner"></span>
          {{ guardandoRespuestas ? 'Guardando...' : 'Guardar respuestas' }}
        </button>
      </template>
    </div>
  </div>
</template>
