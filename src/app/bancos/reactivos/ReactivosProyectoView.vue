<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useProyectoDetalle } from '@/api/proyectos/composable/useProyectoDetalle'
import { useReactivoIdioma } from '@/api/bancos/composable/useReactivoIdioma'
import { useReactivoSeleccionadoStore } from '@/app/bancos/reactivos/useReactivoSeleccionado'
import ReactivoDetalleView from '@/app/bancos/reactivos/ReactivoDetalleView.vue'

const route = useRoute()
const proyectoId = computed(() => String(route.params.id))
const { data: proyecto } = useProyectoDetalle(proyectoId)
const idiomas = computed(() => proyecto.value?.idiomas ?? [])
const idiomaSeleccionado = ref('')
const store = useReactivoSeleccionadoStore()
const { selectedReactivo } = storeToRefs(store)

function normalizarEtiquetaIdioma(etiqueta: string): string {
  return etiqueta.trim().toLowerCase().replace('-', '_')
}

const esIdiomaOriginal = computed(
  () => normalizarEtiquetaIdioma(idiomaSeleccionado.value) === 'es_mx',
)
const idiomaParaConsulta = computed(() =>
  !idiomaSeleccionado.value || esIdiomaOriginal.value ? undefined : idiomaSeleccionado.value,
)
const tipoReactivoId = computed(() => selectedReactivo.value?.tipoReactivoId)

watch(
  idiomas,
  (lista) => {
    if (!lista.some((idioma) => idioma.etiqueta === idiomaSeleccionado.value)) {
      idiomaSeleccionado.value =
        lista.find((idioma) => normalizarEtiquetaIdioma(idioma.etiqueta) === 'es_mx')?.etiqueta ??
        lista[0]?.etiqueta ??
        ''
    }
  },
  { immediate: true },
)

const {
  data: reactivoTraducido,
  isLoading: cargandoTraduccion,
  isError: errorTraduccion,
} = useReactivoIdioma(
  proyectoId,
  () => selectedReactivo.value?.idReactivo,
  idiomaParaConsulta,
  computed(() => tipoReactivoId.value !== 5),
)

const reactivoMostrado = computed(() =>
  idiomaParaConsulta.value ? reactivoTraducido.value : selectedReactivo.value ?? undefined,
)
</script>

<template>
  <ReactivoDetalleView
    :key="proyectoId"
    :banco-id="proyectoId"
    es-proyecto
    :idioma="idiomaParaConsulta"
    :reactivo-mostrado="reactivoMostrado"
    :cargando-idioma="cargandoTraduccion && !!idiomaParaConsulta"
    :error-idioma="errorTraduccion && !!idiomaParaConsulta"
  >
    <template #datos-proyecto>
      <span
        v-if="reactivoMostrado?.estado"
        class="badge badge-sm"
        :class="
          reactivoMostrado.estado === 'Aceptado'
            ? 'badge-success'
            : reactivoMostrado.estado === 'Rechazado'
              ? 'badge-error'
              : 'badge-outline'
        "
      >
        {{ reactivoMostrado.estado }}
      </span>
      <span
        v-if="reactivoMostrado?.hallazgo"
        class="inline-flex items-center gap-1 text-warning"
        title="Tiene hallazgos por revisar"
      >
        <i class="fa-solid fa-triangle-exclamation"></i>
        Hallazgos
      </span>
    </template>

    <template #idiomas>
      <div
        v-if="tipoReactivoId !== 5 && idiomas.length"
        class="tabs tabs-lift"
        role="tablist"
        aria-label="Idioma del reactivo"
      >
        <button
          v-for="idioma in idiomas"
          :key="idioma.etiqueta"
          type="button"
          role="tab"
          class="tab gap-2"
          :class="idiomaSeleccionado === idioma.etiqueta ? 'tab-active' : ''"
          :aria-selected="idiomaSeleccionado === idioma.etiqueta"
          @click="idiomaSeleccionado = idioma.etiqueta"
        >
          <span
            v-if="idiomaSeleccionado === idioma.etiqueta"
            class="status status-warning"
            aria-label="Idioma seleccionado"
          ></span>
          {{ idioma.etiqueta }}
        </button>
      </div>
    </template>
  </ReactivoDetalleView>
</template>
