<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Banco } from '@/api/bancos/interfaces/banco.interface'
import type { Reactivo } from '@/api/bancos/interfaces/reactivo.interface'
import { useReactivos } from '@/api/bancos/composable/useReactivos'
import { useInstruccionesGrupos } from '@/api/bancos/composable/useInstruccionesGrupos'
import { useReactivoSeleccionadoStore } from '@/app/bancos/reactivos/useReactivoSeleccionado'
import { useBancoNavigation } from '@/app/common/banco-navigation'
import { stripHtmlToText } from '@/utils/html'
import {
  construirItemsListado,
  type DisplayGrupo,
  type DisplayItem,
} from '@/app/bancos/reactivos/listado-reactivos'

const props = defineProps<{
  banco: Banco
}>()

const router = useRouter()
const { routeNames } = useBancoNavigation()

const { data: reactivos, isLoading } = useReactivos(props.banco.idBanco)
const tieneGruposRelacionales = computed(() =>
  (reactivos.value ?? []).some((reactivo) => reactivo.tipoReactivoId === 5 && reactivo.grupo > 0),
)
const { data: instrucciones } = useInstruccionesGrupos(props.banco.idBanco, tieneGruposRelacionales)
const { select } = useReactivoSeleccionadoStore()

const itemsParaMostrar = computed<DisplayItem[]>(() =>
  construirItemsListado(reactivos.value ?? [], instrucciones.value ?? []),
)

function preview(r: Reactivo): string {
  return stripHtmlToText(r.descripcion)
}

function irAReactivo(r: Reactivo) {
  select(r)
  router.push({
    name: routeNames.value.reactivos,
    params: { id: props.banco.idBanco },
  })
}

function irAGrupo(item: DisplayGrupo) {
  select(item.primerReactivo)
  router.push({
    name: routeNames.value.reactivos,
    params: { id: props.banco.idBanco },
  })
}

function irAListado() {
  router.push({
    name: routeNames.value.reactivos,
    params: { id: props.banco.idBanco },
  })
}

function irACrear() {
  router.push({
    name: routeNames.value.create,
    params: { id: props.banco.idBanco },
  })
}
</script>

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

      <div v-else-if="itemsParaMostrar.length === 0">
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
          v-for="item in itemsParaMostrar"
          :key="item.tipo === 'individual' ? item.reactivo.idReactivo : `grupo-${item.grupoId}`"
          class="p-4 rounded-lg border border-base-300 cursor-pointer hover:bg-base-200 hover:border-base-content/20 transition-all"
          @click="item.tipo === 'individual' ? irAReactivo(item.reactivo) : irAGrupo(item)"
        >
          <div class="flex items-center justify-between">
            <span class="font-bold text-sm text-base-content">#{{ item.posicion }}</span>
            <span
              v-if="item.tipo === 'grupo'"
              class="badge badge-ghost badge-sm text-base-content/60"
              title="Reactivo relacional (grupo)"
            >
              <i class="fa-regular fa-objects-column text-[11px]"></i>
              Grupo · {{ item.cantidadReactivos }}
            </span>
          </div>
          <p class="text-sm text-base-content/80 leading-relaxed line-clamp-2 mt-1">
            {{ item.tipo === 'individual' ? preview(item.reactivo) : item.instruccion }}
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
