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
  <section class="rounded-2xl bg-base-100 border border-base-300 shadow-sm p-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
      <div>
        <div class="flex items-center gap-2">
          <i class="fa-regular fa-note-sticky text-primary"></i>
          <h2 class="text-sm font-bold uppercase tracking-widest">Hallazgos</h2>
        </div>
        <p class="text-sm text-base-content/60 mt-2">
          Notas y observaciones importantes para el equipo.
        </p>
      </div>

      <button
        type="button"
        class="btn btn-primary btn-sm rounded-lg"
        disabled
        title="Disponible próximamente"
      >
        <i class="fa-regular fa-plus"></i>
        Nuevo hallazgo
      </button>
    </div>

    <div v-if="hallazgos.length === 0" class="rounded-xl border border-dashed border-base-300 p-10 text-center">
      <div class="size-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
        <i class="fa-regular fa-messages text-2xl"></i>
      </div>
      <h3 class="font-semibold mt-4">Aún no hay hallazgos</h3>
      <p class="text-sm text-base-content/60 mt-1">
        Cuando esta sección esté habilitada, aquí aparecerán las notas del equipo.
      </p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <article
        v-for="hallazgo in hallazgos"
        :key="hallazgo.idHallazgo"
        class="rounded-xl border border-base-300 p-4"
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
