<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ProyectoReactivoDetalle from '@/app/proyectos/components/ProyectoReactivoDetalle.vue'

const route = useRoute()
const proyectoId = computed(() => String(route.params.id))
</script>

<template>
  <ProyectoReactivoDetalle :key="proyectoId" :proyecto-id="proyectoId" />
</template>
