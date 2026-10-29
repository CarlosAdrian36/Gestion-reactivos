<template>
  <div class="space-y-5">
    <div>
      <h2 class="text-lg font-bold">Agregar hallazgo</h2>
      <p class="mt-1 text-sm text-base-content/60">
        Registra una nota u observación importante para el equipo.
      </p>
    </div>

    <div class="space-y-4">
      <label class="form-control w-full">
        <span class="label-text mb-2 font-semibold">Título</span>
        <input
          v-model="titulo"
          type="text"
          maxlength="120"
          placeholder="Escribe un título para el hallazgo"
          class="input input-bordered w-full"
        />
      </label>

      <label class="form-control w-full">
        <span class="label-text mb-2 font-semibold">Descripción</span>
        <textarea
          v-model="descripcion"
          rows="5"
          maxlength="1000"
          placeholder="Describe el hallazgo o la observación..."
          class="textarea textarea-bordered w-full resize-y"
        ></textarea>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const titulo = ref('')
const descripcion = ref('')
</script>
