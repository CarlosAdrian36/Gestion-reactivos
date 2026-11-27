<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useProyectoDetalle } from '@/api/proyectos/composable/useProyectoDetalle'
import { useReactivoSeleccionadoStore } from '@/app/bancos/reactivos/useReactivoSeleccionado'
import ProyectoReactivoDetalle from '@/app/proyectos/components/ProyectoReactivoDetalle.vue'

const route = useRoute()
const proyectoId = computed(() => String(route.params.id))

const { data: proyecto } = useProyectoDetalle(proyectoId)
const store = useReactivoSeleccionadoStore()

// Guarda en el store las funciones que el usuario tiene asignadas en este proyecto.
watch(
  proyecto,
  (p) => {
    store.setFunciones(p?.funciones ?? [])
  },
  { immediate: true },
)
</script>

<template>
  <ProyectoReactivoDetalle :key="proyectoId" :proyecto-id="proyectoId" />
</template>
