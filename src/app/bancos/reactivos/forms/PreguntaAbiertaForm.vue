<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { toast } from 'vue-sonner'
import FroalaEditor from '@/components/FroalaEditor.vue'
import { TIPO_REACTIVO, useGuardarReactivo } from '@/api/bancos/composable/useGuardarReactivo'
import type { Reactivo } from '@/api/bancos/interfaces/reactivo.interface'

const props = defineProps<{
  reactivo?: Reactivo
}>()

const route = useRoute()
const bancoId = route.params.id as string
const { guardarPregunta, guardandoPregunta } = useGuardarReactivo(
  bancoId,
  TIPO_REACTIVO.preguntaAbierta,
  props.reactivo?.idReactivo,
)

const pregunta = ref(props.reactivo?.descripcion ?? '')

function guardarPreguntaForm() {
  if (!pregunta.value.trim()) {
    toast.error('La pregunta no puede estar vacía')
    return
  }
  guardarPregunta(pregunta.value)
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
      <div class="flex gap-3 pt-4">
        <button
          class="btn btn-primary"
          :disabled="guardandoPregunta"
          @click="guardarPreguntaForm"
        >
          <span v-if="guardandoPregunta" class="loading loading-spinner"></span>
          {{ guardandoPregunta ? 'Guardando...' : 'Guardar' }}
        </button>
      </div>
    </div>
  </div>
</template>
