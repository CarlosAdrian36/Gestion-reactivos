<script setup lang="ts">
import type { Hallazgo } from '@/api/proyectos/interfaces/proyecto.interface'

withDefaults(
  defineProps<{
    hallazgos?: Hallazgo[]
  }>(),
  {
    hallazgos: () => [],
  },
)

function formatearFecha(fecha: string): string {
  return new Date(fecha).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>

<template>
  <section class="card bg-base-100 border border-base-300 shadow-sm p-6 sm:p-7">
    <!-- Encabezado -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-base-200"
    >
      <div class="flex items-center gap-2.5">
        <div class="p-2 bg-primary/10 text-primary rounded-lg">
          <i class="fa-regular fa-note-sticky"></i>
        </div>
        <div>
          <h2 class="text-xs sm:text-sm font-bold uppercase tracking-wider">Hallazgos</h2>
          <p class="text-xs sm:text-sm text-base-content/60">
            Notas y observaciones importantes para el equipo.
          </p>
        </div>
      </div>

      <button
        type="button"
        disabled
        title="Disponible próximamente"
        class="inline-flex items-center gap-1.5 rounded-xl bg-base-200 px-3.5 py-2 text-xs sm:text-sm font-semibold text-base-content/80 hover:bg-base-300/60 transition-colors self-start sm:self-auto disabled:cursor-not-allowed disabled:opacity-70"
      >
        <i class="fa-regular fa-plus"></i>
        Nuevo hallazgo
      </button>
    </div>

    <!-- Estado vacío -->
    <div
      v-if="hallazgos.length === 0"
      class="mt-6 rounded-xl border border-dashed border-base-300 bg-base-200/40 p-8 sm:p-12 text-center"
    >
      <div
        class="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20 mb-3"
      >
        <i class="fa-regular fa-messages text-xl"></i>
      </div>
      <h3 class="text-sm sm:text-base font-semibold">Aún no hay hallazgos</h3>
      <p class="mt-1 text-xs sm:text-sm text-base-content/60 max-w-sm mx-auto">
        Cuando esta sección esté habilitada, aquí aparecerán las notas y observaciones registradas
        por el equipo.
      </p>
    </div>

    <!-- Listado de hallazgos -->
    <div v-else class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      <article
        v-for="hallazgo in hallazgos"
        :key="hallazgo.idHallazgo"
        class="rounded-xl border border-base-200 bg-base-200/40 p-4"
      >
        <div class="flex items-start justify-between gap-3">
          <h3 class="font-semibold">{{ hallazgo.titulo }}</h3>
          <span class="badge badge-sm">{{ hallazgo.estado }}</span>
        </div>
        <p class="text-sm text-base-content/70 mt-2">{{ hallazgo.descripcion }}</p>
        <div class="flex items-center justify-between gap-3 mt-4 text-xs text-base-content/50">
          <span>{{ hallazgo.prioridad }}</span>
          <span>{{ formatearFecha(hallazgo.fechaCreacion) }}</span>
        </div>
      </article>
    </div>
  </section>
</template>
