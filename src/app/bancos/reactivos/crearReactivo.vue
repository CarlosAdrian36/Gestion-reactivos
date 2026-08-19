<script setup lang="ts">
import { ref } from 'vue'
import OpcionMultipleForm from './forms/OpcionMultipleForm.vue'
import RespuestaMultipleForm from './forms/RespuestaMultipleForm.vue'
import VerdaderoFalsoForm from './forms/VerdaderoFalsoForm.vue'
import PreguntaAbiertaForm from './forms/PreguntaAbiertaForm.vue'
import RelacionalForm from './forms/RelacionalForm.vue'
import { useTiposReactivo } from '@/api/bancos/composable/useTiposReactivo'
import type { TipoReactivoSlug } from '@/api/bancos/interfaces/tipo-reactivo.interface'

const { tipos, isLoading } = useTiposReactivo()

const paso = ref<'grid' | 'formulario'>('grid')
const tipoSeleccionado = ref<TipoReactivoSlug | null>(null)

function seleccionarTipo(tipo: TipoReactivoSlug) {
  tipoSeleccionado.value = tipo
  paso.value = 'formulario'
}

function volverAGrid() {
  paso.value = 'grid'
  tipoSeleccionado.value = null
}
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <div v-if="paso === 'grid'">
      <div class="mb-8">
        <h1 class="text-3xl font-bold">Crear Reactivo</h1>
        <p class="text-base-content/70 mt-1">Selecciona el tipo de reactivo que deseas crear</p>
      </div>

      <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="i in 4" :key="i" class="card bg-base-100 border border-base-300 p-6 space-y-3">
          <div class="skeleton size-12 rounded-xl"></div>
          <div class="skeleton h-4 w-2/3"></div>
          <div class="skeleton h-3 w-full"></div>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="tipo in tipos"
          :key="tipo.id"
          class="card bg-base-100 border border-base-300 hover:border-primary hover:shadow-md transition-all cursor-pointer p-6"
          @click="seleccionarTipo(tipo.id)"
        >
          <div class="flex items-start gap-4">
            <div class="size-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <i :class="tipo.icono + ' text-primary text-xl'"></i>
            </div>
            <div class="min-w-0">
              <h3 class="font-semibold text-lg">{{ tipo.nombre }}</h3>
              <p class="text-sm text-base-content/60 mt-1">{{ tipo.descripcion }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="tipoSeleccionado">
      <button class="btn btn-ghost btn-sm mb-6 gap-2" @click="volverAGrid">
        <i class="fa-regular fa-arrow-left"></i>
        Volver a tipos
      </button>

      <OpcionMultipleForm v-if="tipoSeleccionado === 'opcion-multiple'" />
      <RespuestaMultipleForm v-else-if="tipoSeleccionado === 'respuesta-multiple'" />
      <VerdaderoFalsoForm v-else-if="tipoSeleccionado === 'verdadero-falso'" />
      <PreguntaAbiertaForm v-else-if="tipoSeleccionado === 'pregunta-abierta'" />
      <RelacionalForm v-else-if="tipoSeleccionado === 'relacional'" />
    </div>
  </div>
</template>
