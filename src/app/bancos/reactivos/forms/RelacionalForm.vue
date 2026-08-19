<script setup lang="ts">
import { ref } from 'vue'
import FroalaEditor from '@/components/FroalaEditor.vue'

const emit = defineEmits<{
  guardar: [data: Record<string, unknown>]
}>()

const pregunta = ref('')
const pares = ref([{ izquierda: '', derecha: '' }, { izquierda: '', derecha: '' }])

function agregarPar() {
  pares.value.push({ izquierda: '', derecha: '' })
}

function quitarPar(index: number) {
  if (pares.value.length > 2) {
    pares.value.splice(index, 1)
  }
}

function guardar() {
  emit('guardar', {
    pregunta: pregunta.value,
    pares: pares.value.map(p => ({ izquierda: p.izquierda, derecha: p.derecha })),
  })
}
</script>

<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold">Relacional</h2>

    <div>
      <label class="label font-semibold">Instrucciones</label>
      <FroalaEditor v-model="pregunta" :config="{
        toolbarButtons: ['bold', 'italic', 'underline', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'undo', 'redo'],
        placeholderText: 'Escribe las instrucciones aquí...',
        heightMin: 120,
      }" />
    </div>

    <div>
      <div class="flex items-center justify-between mb-2">
        <label class="label font-semibold">Pares (Columna A → Columna B)</label>
        <button class="btn btn-ghost btn-xs gap-1" @click="agregarPar">
          <i class="fa-regular fa-plus"></i>
          Agregar par
        </button>
      </div>

      <div
        v-for="(par, index) in pares"
        :key="index"
        class="flex items-center gap-2 mb-2"
      >
        <input
          v-model="par.izquierda"
          type="text"
          class="input input-bordered input-sm flex-1"
          placeholder="Término"
        />
        <i class="fa-regular fa-arrow-right text-base-content/40"></i>
        <input
          v-model="par.derecha"
          type="text"
          class="input input-bordered input-sm flex-1"
          placeholder="Definición"
        />
        <button
          v-if="pares.length > 2"
          class="btn btn-ghost btn-xs text-error"
          @click="quitarPar(index)"
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
