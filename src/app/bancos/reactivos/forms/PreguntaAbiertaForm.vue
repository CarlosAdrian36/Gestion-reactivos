<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { toast } from 'vue-sonner'
import FroalaEditor from '@/components/FroalaEditor.vue'
import { TIPO_REACTIVO, useGuardarReactivo } from '@/api/bancos/composable/useGuardarReactivo'
import type { Reactivo } from '@/api/bancos/interfaces/reactivo.interface'
import { preguntaConfig } from './froalaConfig'

const props = defineProps<{
  reactivo?: Reactivo
}>()

const route = useRoute()
const bancoId = route.params.id as string
const { guardarTodo, isGuardando } = useGuardarReactivo(
  bancoId,
  TIPO_REACTIVO.preguntaAbierta,
  props.reactivo?.idReactivo,
)

const pregunta = ref(props.reactivo?.descripcion ?? '')

async function guardarPreguntaForm() {
  if (!pregunta.value.trim()) {
    toast.error('La pregunta no puede estar vacía')
    return
  }
  await guardarTodo(pregunta.value)
}
</script>

<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold">Pregunta Abierta</h2>

    <div>
      <label class="label font-semibold">Pregunta</label>
      <FroalaEditor v-model="pregunta" :config="preguntaConfig" />
      <div class="flex gap-3 pt-4">
        <button
          class="btn btn-primary"
          :disabled="isGuardando"
          @click="guardarPreguntaForm"
        >
          <span v-if="isGuardando" class="loading loading-spinner"></span>
          {{ isGuardando ? 'Guardando...' : 'Guardar' }}
        </button>
      </div>
    </div>
  </div>
</template>
