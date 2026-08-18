<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useReactivosStore } from './reactivosStore'
import { useRespuestas } from '@/api/bancos/composable/useRespuestas'
import OpcionMultipleForm from './forms/OpcionMultipleForm.vue'
import RespuestaMultipleForm from './forms/RespuestaMultipleForm.vue'
import VerdaderoFalsoForm from './forms/VerdaderoFalsoForm.vue'
import PreguntaAbiertaForm from './forms/PreguntaAbiertaForm.vue'

const route = useRoute()
const router = useRouter()
const bancoId = String(route.params.id)
const { selectedReactivo } = useReactivosStore()

const { data: respuestas, isLoading: cargandoRespuestas } = useRespuestas(
  bancoId,
  () => selectedReactivo.value?.idReactivo,
)

const tipoReactivoId = computed(() => selectedReactivo.value?.tipoReactivoId)

function volver() {
  router.push({ name: 'reactivosList', params: { id: bancoId } })
}

onMounted(() => {
  if (!selectedReactivo.value) {
    router.replace({ name: 'reactivosList', params: { id: bancoId } })
  }
})
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <!-- <button class="btn btn-ghost btn-sm mb-6 gap-2" @click="volver">
      <i class="fa-regular fa-arrow-left"></i>
      Volver
    </button> -->

    <template v-if="selectedReactivo">
      <div class="breadcrumbs text-sm mb-6">
        <ul>
          <li>
            <RouterLink class="link link-hover" :to="{ name: 'misBancos' }">Inicio</RouterLink>
          </li>
          <li>
            <RouterLink
              class="link link-hover"
              :to="{ name: 'bancoDetalle', params: { id: bancoId } }"
              >Banco Detalle</RouterLink
            >
          </li>
          <li>
            <RouterLink
              class="link link-hover"
              :to="{ name: 'reactivosList', params: { id: bancoId } }"
            >
              Reactivo {{ selectedReactivo.posicion }}
            </RouterLink>
          </li>
          <li class="text-base-content/60">Edición</li>
        </ul>
      </div>

      <div class="mb-6">
        <h1 class="text-3xl font-bold">Editar Reactivo #{{ selectedReactivo.posicion }}</h1>
        <p class="text-base-content/70 mt-1">Modifica el enunciado y las respuestas</p>
      </div>

      <div v-if="cargandoRespuestas" class="space-y-2">
        <div class="skeleton h-40 w-full rounded-xl"></div>
        <div class="skeleton h-32 w-full rounded-xl"></div>
      </div>

      <template v-else>
        <OpcionMultipleForm
          v-if="tipoReactivoId === 1"
          :reactivo="selectedReactivo"
          :respuestas="respuestas"
        />
        <RespuestaMultipleForm
          v-else-if="tipoReactivoId === 2"
          :reactivo="selectedReactivo"
          :respuestas="respuestas"
        />
        <VerdaderoFalsoForm
          v-else-if="tipoReactivoId === 3"
          :reactivo="selectedReactivo"
          :respuestas="respuestas"
        />
        <PreguntaAbiertaForm v-else-if="tipoReactivoId === 4" :reactivo="selectedReactivo" />
        <div
          v-else-if="tipoReactivoId === 5"
          class="card bg-base-100 border border-base-300 p-10 text-center"
        >
          <i class="fa-regular fa-arrow-right-arrow-left text-4xl text-base-content/40 mb-4"></i>
          <p class="font-semibold text-base-content">
            La edición de reactivos relacionales estará disponible próximamente.
          </p>
        </div>
      </template>
    </template>
  </div>
</template>
