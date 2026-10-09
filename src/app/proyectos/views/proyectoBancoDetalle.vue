<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useProyectoDetalle } from '@/api/proyectos/composable/useProyectoDetalle'
import ProyectoDetalleBlank from '@/app/proyectos/layouts/ProyectoDetalleBlank.vue'

const route = useRoute()
const proyectoId = computed(() => String(route.params.id))
const { data, isLoading, isError } = useProyectoDetalle(proyectoId)
</script>

<template>
  <div class="min-h-full">
    <main class="min-h-full">
      <template v-if="isLoading">
        <div class="mx-auto max-w-9xl px-4 py-5 sm:px-6 lg:px-8 space-y-5">
          <div class="skeleton h-36 w-full rounded-xl"></div>
          <div class="grid grid-cols-1 xl:grid-cols-12 gap-5">
            <div class="skeleton h-72 rounded-xl xl:col-span-4"></div>
            <div class="skeleton h-72 rounded-xl xl:col-span-8"></div>
          </div>
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div class="skeleton h-72 rounded-xl lg:col-span-8"></div>
            <div class="skeleton h-72 rounded-xl lg:col-span-4"></div>
          </div>
        </div>
      </template>

      <div
        v-else-if="isError || !data"
        class="mx-auto max-w-9xl px-4 py-5 sm:px-6 lg:px-8"
      >
        <div class="rounded-2xl bg-base-100 border border-error/30 p-10 text-center">
          <div
            class="size-16 rounded-full bg-error/10 text-error flex items-center justify-center mx-auto"
          >
            <i class="fa-regular fa-triangle-exclamation text-2xl"></i>
          </div>
          <h1 class="text-xl font-bold mt-4">No se pudo cargar el proyecto</h1>
          <p class="text-sm text-base-content/60 mt-2">
            Verifica que el proyecto exista o intenta nuevamente.
          </p>
        </div>
      </div>

      <ProyectoDetalleBlank v-else :proyecto="data" />
    </main>
  </div>
</template>
