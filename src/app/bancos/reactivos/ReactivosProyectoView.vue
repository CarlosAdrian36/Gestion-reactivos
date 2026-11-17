<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useReactivoSeleccionadoStore } from '@/app/bancos/reactivos/useReactivoSeleccionado'
import ReactivoDetalleView from '@/app/bancos/reactivos/ReactivoDetalleView.vue'

const route = useRoute()
const proyectoId = computed(() => String(route.params.id))
const store = useReactivoSeleccionadoStore()
const { selectedReactivo } = storeToRefs(store)

const reactivoMostrado = computed(() => selectedReactivo.value ?? undefined)
</script>

<template>
  <ReactivoDetalleView
    :key="proyectoId"
    :banco-id="proyectoId"
    es-proyecto
    :reactivo-mostrado="reactivoMostrado"
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
  </ReactivoDetalleView>
</template>
