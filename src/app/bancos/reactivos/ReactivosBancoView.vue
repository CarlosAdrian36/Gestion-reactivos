<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ReactivoDetalleView from '@/app/bancos/reactivos/ReactivoDetalleView.vue'

const route = useRoute()
const bancoId = computed(() => String(route.params.id))
</script>

<template>
  <ReactivoDetalleView :key="bancoId" :banco-id="bancoId" />
</template>
