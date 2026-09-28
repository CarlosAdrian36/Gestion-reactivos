<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Banco } from '@/api/bancos/interfaces/banco.interface'
import type { Reactivo } from '@/api/bancos/interfaces/reactivo.interface'
import { useReactivos } from '@/api/bancos/composable/useReactivos'
import { useReactivoSeleccionadoStore } from '@/app/bancos/reactivos/useReactivoSeleccionado'
import { useBancoNavigation } from '@/app/common/banco-navigation'
import { stripHtmlToText } from '@/utils/html'

const props = defineProps<{
  banco: Banco
}>()

const router = useRouter()
const { routeNames } = useBancoNavigation()

const { data: reactivos, isLoading } = useReactivos(props.banco.idBanco)
const { select } = useReactivoSeleccionadoStore()

const totalReactivos = computed(() => reactivos.value?.length ?? props.banco.cantidadReactivos)

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
  <section class="h-full flex flex-col card bg-base-100 border border-base-300 shadow-sm p-6">
    <!-- Encabezado -->
    <div class="flex items-center justify-between pb-4 border-b border-base-200">
      <button
        class="flex items-center gap-2.5 px-0 text-left hover:opacity-70 transition-opacity cursor-pointer"
        @click="irAListado"
      >
        <div class="p-2 bg-primary/10 text-primary rounded-lg">
          <i class="fa-regular fa-file-lines"></i>
        </div>
        <h2 class="text-xs sm:text-sm font-bold uppercase tracking-wider">Listado de Reactivos</h2>
      </button>
      <span
        class="inline-flex items-center rounded-full bg-base-200 px-2.5 py-0.5 text-xs font-semibold text-base-content/70"
      >
        {{ totalReactivos }} {{ totalReactivos === 1 ? 'reactivo' : 'reactivos' }}
      </span>
    </div>

    <!-- Contenido -->
    <div class="overflow-y-auto max-h-80 py-4 space-y-2">
      <template v-if="isLoading">
        <div v-for="i in 3" :key="i" class="p-4 rounded-xl border border-base-200 space-y-2">
          <div class="skeleton h-4 w-24"></div>
          <div class="skeleton h-3 w-full"></div>
          <div class="skeleton h-3 w-2/3"></div>
        </div>
      </template>

      <div v-else-if="!reactivos || reactivos.length === 0" class="py-10 px-4 text-center">
        <div
          class="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20 shadow-inner mb-4"
        >
          <i class="fa-regular fa-file-circle-plus text-3xl"></i>
        </div>
        <h3 class="text-base font-semibold">No hay reactivos aún</h3>
        <p class="mt-2 text-xs sm:text-sm text-base-content/60 max-w-xs mx-auto">
          Comienza agregando el primer reactivo a este banco para empezar a trabajar con el equipo.
        </p>
      </div>

      <div v-else class="space-y-2">
        <div
          v-for="r in reactivos"
          :key="r.idReactivo"
          class="p-4 rounded-xl border border-base-200 bg-base-200/40 cursor-pointer hover:bg-base-200 hover:border-base-content/20 transition-all"
          @click="irAReactivo(r)"
        >
          <span class="font-bold text-sm">#{{ r.posicion }}</span>
          <p class="text-sm text-base-content/75 leading-relaxed line-clamp-2 mt-1">
            {{ preview(r) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Acción principal -->
    <div class="mt-auto pt-4 border-t border-base-200">
      <button
        class="w-full inline-flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 px-4 py-3 text-sm font-semibold text-primary hover:bg-primary/10 hover:border-primary/40 transition-all"
        @click="irACrear"
      >
        <i class="fa-regular fa-plus"></i>
        Crear Reactivo
      </button>
    </div>
  </section>
</template>
