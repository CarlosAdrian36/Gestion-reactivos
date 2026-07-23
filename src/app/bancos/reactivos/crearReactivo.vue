<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import OpcionMultipleForm from './forms/OpcionMultipleForm.vue'
import RespuestaMultipleForm from './forms/RespuestaMultipleForm.vue'
import VerdaderoFalsoForm from './forms/VerdaderoFalsoForm.vue'
import PreguntaAbiertaForm from './forms/PreguntaAbiertaForm.vue'
import RelacionalForm from './forms/RelacionalForm.vue'

const route = useRoute()
const bancoId = route.params.id as string

type TipoReactivo = 'opcion-multiple' | 'respuesta-multiple' | 'verdadero-falso' | 'pregunta-abierta' | 'relacional'

const paso = ref<'grid' | 'formulario'>('grid')
const tipoSeleccionado = ref<TipoReactivo | null>(null)

const tipos = [
  { id: 'opcion-multiple' as TipoReactivo, nombre: 'Opción Múltiple', descripcion: 'Seleccionar una opción correcta entre varias', icono: 'fa-regular fa-list-check' },
  { id: 'respuesta-multiple' as TipoReactivo, nombre: 'Respuesta Múltiple', descripcion: 'Seleccionar varias opciones correctas', icono: 'fa-regular fa-rectangle-list' },
  { id: 'verdadero-falso' as TipoReactivo, nombre: 'Verdadero/Falso', descripcion: 'Determinar si una afirmación es verdadera o falsa', icono: 'fa-regular fa-toggle-on' },
  { id: 'pregunta-abierta' as TipoReactivo, nombre: 'Pregunta Abierta', descripcion: 'Respuesta libre y abierta', icono: 'fa-regular fa-file-lines' },
  { id: 'relacional' as TipoReactivo, nombre: 'Relacional', descripcion: 'Relacionar elementos de dos columnas', icono: 'fa-regular fa-arrow-right-arrow-left' },
]

function seleccionarTipo(tipo: TipoReactivo) {
  tipoSeleccionado.value = tipo
  paso.value = 'formulario'
}

function volverAGrid() {
  paso.value = 'grid'
  tipoSeleccionado.value = null
}

function guardar(data: Record<string, unknown>) {
  console.log('=== NUEVO REACTIVO ===')
  console.log('Banco ID:', bancoId)
  console.log('Tipo:', tipoSeleccionado.value)
  console.log('Datos:', data)
}
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <div v-if="paso === 'grid'">
      <div class="mb-8">
        <h1 class="text-3xl font-bold">Crear Reactivo</h1>
        <p class="text-base-content/70 mt-1">Selecciona el tipo de reactivo que deseas crear</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      <OpcionMultipleForm
        v-if="tipoSeleccionado === 'opcion-multiple'"
        @guardar="guardar"
      />
      <RespuestaMultipleForm
        v-else-if="tipoSeleccionado === 'respuesta-multiple'"
        @guardar="guardar"
      />
      <VerdaderoFalsoForm
        v-else-if="tipoSeleccionado === 'verdadero-falso'"
        @guardar="guardar"
      />
      <PreguntaAbiertaForm
        v-else-if="tipoSeleccionado === 'pregunta-abierta'"
        @guardar="guardar"
      />
      <RelacionalForm
        v-else-if="tipoSeleccionado === 'relacional'"
        @guardar="guardar"
      />
    </div>
  </div>
</template>
