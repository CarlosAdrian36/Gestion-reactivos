<script setup lang="ts">
import { computed, ref } from 'vue'
import { useReactivoIdioma } from '@/api/bancos/composable/useReactivoIdioma'
import { useRespuestas } from '@/api/bancos/composable/useRespuestas'
import TraduccionEditor from '@/app/bancos/reactivos/components/TraduccionEditor.vue'
import ReactivoContenido from '@/app/proyectos/components/ReactivoContenido.vue'
import { useModalStore } from '@/common/modals/store/modal.store'
import eliminarReactivo from '@/app/common/components/modals/eliminarReactivo.vue'
import type { Reactivo } from '@/api/bancos/interfaces/reactivo.interface'

const props = defineProps<{
  proyectoId: string
  /** Reactivo original (es_MX) del que se consulta la traducción. */
  reactivo: Reactivo
  /** Etiqueta del idioma destino, p. ej. 'en_US'. */
  idioma: string
}>()

// Consulta la traducción del idioma seleccionado (null si no existe).
const {
  data: traduccion,
  isLoading: cargando,
  isError: error,
} = useReactivoIdioma(
  props.proyectoId,
  () => props.reactivo.idReactivo,
  () => props.idioma,
)

const sinTraduccion = computed(() => !cargando.value && !error.value && !traduccion.value)

// Respuestas del reactivo traducido (para precargar el editor en modo actualizar).
const { data: respuestasTraducidas } = useRespuestas(
  props.proyectoId,
  () => traduccion.value?.idReactivo,
  () => props.idioma,
)

// Alterna entre ver la traducción y mostrar el editor para crearla/actualizarla.
const traduciendo = ref(false)

// Traducción existente (para el modo actualizar del editor).
const traduccionActual = computed(() => {
  if (!traduccion.value) return undefined
  return {
    idReactivo: traduccion.value.idReactivo,
    descripcion: traduccion.value.descripcion,
    respuestas: respuestasTraducidas.value ?? [],
  }
})

const modal = useModalStore()

function abrirEliminar() {
  if (!traduccion.value) return
  modal.openModal(
    eliminarReactivo,
    {
      bancoId: props.proyectoId,
      reactivo: props.reactivo,
      traduccion: { idReactivo: traduccion.value.idReactivo, idioma: props.idioma },
    },
    [
      { label: 'Cerrar', variant: 'outline' },
      { label: 'Eliminar', variant: 'error', type: 'submit' },
    ],
  )
}
</script>

<template>
  <TraduccionEditor
    v-if="traduciendo"
    :banco-id="props.proyectoId"
    :reactivo="props.reactivo"
    :idioma="props.idioma"
    :traduccion-actual="traduccionActual"
    @cancelar="traduciendo = false"
    @guardado="traduciendo = false"
  />

  <!-- Cargando -->
  <div v-else-if="cargando" class="p-8 space-y-4">
    <div class="skeleton h-6 w-48"></div>
    <div class="skeleton h-40 w-full rounded-xl"></div>
    <div class="skeleton h-24 w-full rounded-xl"></div>
  </div>

  <!-- Error -->
  <div v-else-if="error" class="p-8 text-center text-sm text-error">
    No se pudo cargar el reactivo en {{ props.idioma }}.
  </div>

  <!-- Sin traducción -->
  <div
    v-else-if="sinTraduccion"
    class="flex flex-col items-center justify-center gap-4 p-8 text-center min-h-40"
  >
    <p class="text-sm text-base-content/60">
      <i class="fa-regular fa-language me-2"></i>
      Este reactivo no tiene traducción en {{ props.idioma }}.
    </p>
    <button type="button" class="btn btn-warning btn-sm gap-2" @click="traduciendo = true">
      <i class="fa-regular fa-language"></i>
      Traducir
    </button>
  </div>

  <!-- Traducción existente: toolbar + contenido -->
  <div v-else-if="traduccion">
    <div class="flex items-center justify-between px-8 pt-6">
      <h3
        class="text-xs font-bold uppercase tracking-wider text-base-content/60 flex items-center gap-2"
      >
        <i class="fa-regular fa-language text-[14px]"></i>
        Traducción en {{ props.idioma }}
      </h3>
      <div class="flex gap-2">
        <button
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-warning text-xs font-medium text-warning hover:bg-warning/10 transition-colors cursor-pointer"
          @click="traduciendo = true"
        >
          <i class="fa-regular fa-language text-[14px]"></i>
          Traducir
        </button>
        <button
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-error text-error-content text-xs font-bold hover:bg-primary-dark transition-colors shadow-sm cursor-pointer"
          @click="abrirEliminar"
        >
          <i class="fa-regular fa-trash"></i>
          Eliminar traducción
        </button>
      </div>
    </div>
    <ReactivoContenido
      :proyecto-id="props.proyectoId"
      :reactivo="traduccion"
      :idioma="props.idioma"
    />
  </div>
</template>
