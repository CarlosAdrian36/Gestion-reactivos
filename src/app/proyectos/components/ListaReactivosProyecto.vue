<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  esReactivoDeProyecto,
  tieneHallazgos,
  type ReactivoProyecto,
} from '@/api/bancos/interfaces/reactivo.interface'
import { useReactivosProyecto } from '@/api/proyectos/composable/useReactivosProyecto'
import { useReactivoSeleccionadoStore } from '@/app/bancos/reactivos/useReactivoSeleccionado'
import { useBancoNavigation } from '@/app/common/banco-navigation'
import { stripHtmlToText } from '@/utils/html'

const props = defineProps<{
  idProyecto: string
  /** Total reportado por el proyecto, usado como respaldo mientras carga. */
  total?: number
}>()

const router = useRouter()
const { routeNames } = useBancoNavigation()
const { select } = useReactivoSeleccionadoStore()

const { data, isLoading, isError } = useReactivosProyecto(() => props.idProyecto)

const reactivos = computed(() => data.value ?? [])
const totalReactivos = computed(() => reactivos.value.length || props.total || 0)

function preview(reactivo: ReactivoProyecto): string {
  return stripHtmlToText(reactivo.descripcion)
}

function irAReactivo(reactivo: ReactivoProyecto): void {
  select(reactivo)
  router.push({
    name: routeNames.value.reactivos,
    params: { id: props.idProyecto },
  })
}

function irACrear(): void {
  router.push({
    name: routeNames.value.create,
    params: { id: props.idProyecto },
  })
}
</script>

<template>
  <section
    class="card flex h-full min-h-72 flex-col border border-base-300 bg-base-100 md:min-h-0 p-5 sm:p-6 short:p-3"
  >
    <!-- Encabezado -->
    <div class="flex items-center justify-between pb-4 border-b border-base-200">
      <div class="flex items-center gap-2.5">
        <div class="p-2 bg-primary/10 text-primary rounded-lg">
          <i class="fa-regular fa-file-lines"></i>
        </div>
        <h2 class="text-xs sm:text-sm font-bold uppercase tracking-wider">Reactivos</h2>
      </div>
      <span
        class="inline-flex items-center rounded-full bg-base-200 px-2.5 py-0.5 text-xs font-semibold text-base-content/70"
      >
        {{ totalReactivos }} {{ totalReactivos === 1 ? 'reactivo' : 'reactivos' }}
      </span>
    </div>

    <!-- Contenido -->
    <div class="min-h-0 flex-1 overflow-y-auto py-4 space-y-2">
      <template v-if="isLoading">
        <div v-for="i in 3" :key="i" class="p-4 rounded-xl border border-base-200 space-y-2">
          <div class="skeleton h-4 w-16"></div>
          <div class="skeleton h-3 w-full"></div>
          <div class="skeleton h-3 w-2/3"></div>
        </div>
      </template>

      <div v-else-if="isError" class="py-10 px-4 text-center text-sm text-base-content/60">
        No se pudieron cargar los reactivos.
      </div>

      <div
        v-else-if="reactivos.length === 0"
        class="flex h-full flex-col items-center justify-center px-4 py-10 text-center"
      >
        <div
          class="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20 shadow-inner mb-4"
        >
          <i class="fa-regular fa-file-circle-plus text-3xl"></i>
        </div>
        <h3 class="text-base font-semibold">No hay reactivos aún</h3>
        <p class="mt-2 text-xs sm:text-sm text-base-content/60 max-w-xs mx-auto">
          Comienza agregando el primer reactivo a este proyecto.
        </p>
      </div>

      <div v-else class="space-y-2">
        <button
          v-for="reactivo in reactivos"
          :key="reactivo.idReactivo"
          type="button"
          class="block w-full text-left p-4 rounded-xl border border-base-200 bg-base-200/40 cursor-pointer hover:bg-base-200 hover:border-base-content/20 transition-all"
          @click="irAReactivo(reactivo)"
        >
          <div class="flex items-center justify-between gap-2">
            <span class="flex items-center gap-2 font-bold text-sm">
              #{{ reactivo.posicion }}
              <i
                v-if="tieneHallazgos(reactivo)"
                class="fa-solid fa-triangle-exclamation text-warning text-xs"
                title="Tiene hallazgos por revisar"
              ></i>
            </span>
            <span
              v-if="esReactivoDeProyecto(reactivo)"
              class="badge badge-sm"
              :class="reactivo.estado === 'Aceptado' ? 'badge-success' : 'badge-error'"
            >
              {{ reactivo.estado }}
            </span>
          </div>
          <p class="text-sm text-base-content/75 leading-relaxed line-clamp-2 mt-1">
            {{ preview(reactivo) }}
          </p>
        </button>
      </div>
    </div>

    <!-- Acción principal -->
    <div class="mt-4 border-t border-base-200 pt-4">
      <button
        type="button"
        class="w-full inline-flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 px-4 py-3 text-sm font-semibold text-primary hover:bg-primary/10 hover:border-primary/40 transition-all"
        @click="irACrear"
      >
        <i class="fa-regular fa-plus"></i>
        Crear reactivo
      </button>
    </div>
  </section>
</template>