<script setup lang="ts">
import { useReactivos } from '@/api/bancos/composable/useReactivos'
import { useRespuestas } from '@/api/bancos/composable/useRespuestas'
import DetalleOpcionMultiple from '@/app/bancos/reactivos/components/DetalleOpcionMultiple.vue'
import DetalleVerdaderoFalso from '@/app/bancos/reactivos/components/DetalleVerdaderoFalso.vue'
import DetalleRelacional from '@/app/bancos/reactivos/components/DetalleRelacional.vue'
import ReactivoMetadata from '@/app/proyectos/components/ReactivoMetadata.vue'
import type { Reactivo } from '@/api/bancos/interfaces/reactivo.interface'

const props = defineProps<{
  proyectoId: string
  reactivo: Reactivo
  /** Idioma destino para consultar respuestas traducidas (manda el header Idioma). */
  idioma?: string
}>()

// Respuestas del reactivo que recibe (original o traducido). Para el traducido
// se usa el id del reactivo traducido + el header Idioma con la etiqueta.
const {
  data: respuestas,
  isLoading: cargandoRespuestas,
  isError: errorRespuestas,
} = useRespuestas(
  props.proyectoId,
  () => props.reactivo.idReactivo,
  () => props.idioma,
)

// Lista completa de reactivos (solo la necesita el tipo relacional).
const { data: reactivos } = useReactivos(props.proyectoId)
</script>

<template>
  <div class="p-8 space-y-8">
    <!-- Enunciado (no aplica para el tipo relacional) -->
    <div v-if="props.reactivo.tipoReactivoId !== 5" class="space-y-3">
      <h3
        class="text-xs font-bold uppercase tracking-wider text-base-content/60 flex items-center gap-2"
      >
        <i class="fa-regular fa-file-lines text-[14px]"></i>
        Descripción / Enunciado
      </h3>
      <div class="bg-base-200 rounded-xl p-6">
        <div
          class="fr-view text-lg text-base-content leading-relaxed [&_p]:m-0"
          v-html="props.reactivo.descripcion"
        ></div>
      </div>
    </div>

    <!-- Respuestas según el tipo de reactivo -->
    <DetalleOpcionMultiple
      v-if="props.reactivo.tipoReactivoId === 1 || props.reactivo.tipoReactivoId === 2"
      :respuestas="respuestas ?? []"
      :cargando="cargandoRespuestas"
      :error="errorRespuestas"
    />
    <DetalleVerdaderoFalso
      v-else-if="props.reactivo.tipoReactivoId === 3"
      :respuestas="respuestas ?? []"
      :cargando="cargandoRespuestas"
      :error="errorRespuestas"
    />
    <DetalleRelacional
      v-else-if="props.reactivo.tipoReactivoId === 5"
      :banco-id="props.proyectoId"
      :grupo="props.reactivo.grupo"
      :reactivos="reactivos ?? []"
    />

    <!-- Footer de metadata -->
    <ReactivoMetadata :reactivo="props.reactivo" />
  </div>
</template>
