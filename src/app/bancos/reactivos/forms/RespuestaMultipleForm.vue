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
  useGuardarReactivo(bancoId, TIPO_REACTIVO.respuestaMultiple)

const pregunta = ref('')
const opciones = ref([{ texto: '', correcta: false }, { texto: '', correcta: false }])

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
      <div class="flex gap-3 pt-4">
        <button
          class="btn btn-primary"
          :disabled="guardandoPregunta"
          @click="guardarPreguntaForm"
        >
          <span v-if="guardandoPregunta" class="loading loading-spinner"></span>
          {{ guardandoPregunta ? 'Guardando...' : 'Guardar pregunta' }}
        </button>
      </div>
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
        <div class="flex-1 min-w-0">
          <input
            v-model="opcion.texto"
            type="text"
            class="input input-bordered input-sm w-full"
            :placeholder="`Opción ${String.fromCharCode(65 + index)}`"
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
        :disabled="guardandoRespuestas"
        @click="guardarRespuestaForm"
      >
        <span v-if="guardandoRespuestas" class="loading loading-spinner"></span>
        {{ guardandoRespuestas ? 'Guardando...' : 'Guardar respuestas' }}
      </button>
    </div>
  </div>
</template>
