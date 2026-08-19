<template>
  <div class="flex flex-col h-full">
    <button
      class="flex items-center gap-2 mb-6 px-0 text-left hover:opacity-70 transition-opacity cursor-pointer"
      @click="irAListado"
    >
      <i class="fa-regular fa-ballot-check text-primary"></i>
      <h2 class="text-xs font-bold uppercase tracking-widest">Listado de Reactivos</h2>
    </button>

    <!-- Contenido -->
    <div class="grow overflow-y-auto max-h-80 pr-2 space-y-2">
      <template v-if="isLoading">
        <div v-for="i in 3" :key="i" class="p-4 rounded-lg border border-base-300 space-y-2">
          <div class="skeleton h-4 w-24"></div>
          <div class="skeleton h-3 w-full"></div>
          <div class="skeleton h-3 w-2/3"></div>
        </div>
      </template>

      <div v-else-if="reactivos && reactivos.length === 0">
        <div
          class="size-20 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-5"
        >
          <i class="fa-regular fa-file-circle-plus text-4xl"></i>
        </div>

        <h3 class="font-bold text-lg">No hay reactivos</h3>

        <p class="text-sm text-base-content/60 mt-2 max-w-xs">
          Comienza agregando el primer reactivo a este banco para empezar a trabajar.
        </p>
      </div>

      <div v-else class="space-y-2">
        <div
          v-for="r in reactivos"
          :key="r.idReactivo"
          class="p-4 rounded-lg border border-base-300 cursor-pointer hover:bg-base-200 hover:border-base-content/20 transition-all"
          @click="irAReactivo(r)"
        >
          <span class="font-bold text-sm text-base-content">#{{ r.posicion }}</span>
          <p class="text-sm text-base-content/80 leading-relaxed line-clamp-2 mt-1">
            {{ preview(r) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Botón -->
    <div class="mt-auto pt-5">
      <button class="btn btn-dash btn-block btn-primary btn-sm rounded-lg" @click="irACrear">
        Crear Reactivo
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { Banco } from '@/api/bancos/interfaces/banco.interface'
import type { Reactivo } from '@/api/bancos/interfaces/reactivo.interface'
import { useReactivos } from '@/api/bancos/composable/useReactivos'
import { useReactivoSeleccionadoStore } from '@/app/bancos/reactivos/useReactivoSeleccionado'
import { stripHtmlToText } from '@/utils/html'

const props = defineProps<{
  banco: Banco
}>()

const router = useRouter()

const { data: reactivos, isLoading } = useReactivos(props.banco.idBanco)
const { select } = useReactivoSeleccionadoStore()

function preview(r: Reactivo): string {
  return stripHtmlToText(r.descripcion)
}

function irAReactivo(r: Reactivo) {
  select(r)
  router.push({
    name: 'reactivosList',
    params: { id: props.banco.idBanco },
  })
}

function irAListado() {
  router.push({
    name: 'reactivosList',
    params: { id: props.banco.idBanco },
  })
}

function irACrear() {
  router.push({
    name: 'crearReactivo',
    params: { id: props.banco.idBanco },
  })
}
</script>
