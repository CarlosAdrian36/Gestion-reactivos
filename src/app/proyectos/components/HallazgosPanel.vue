<script setup lang="ts">
import { ref } from 'vue'
import type { Hallazgo } from '@/api/proyectos/interfaces/proyecto.interface'

const emit = defineEmits<{
  agregarHallazgo: []
}>()

withDefaults(
  defineProps<{
    hallazgos?: Hallazgo[]
  }>(),
  {
    hallazgos: () => [],
  },
)

const hallazgosExpandidos = ref<Array<string | number>>([])

function formatearFecha(fecha: string): string {
  return new Date(fecha).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function alternarHallazgo(id: string | number): void {
  hallazgosExpandidos.value = hallazgosExpandidos.value.includes(id)
    ? hallazgosExpandidos.value.filter((idExpandido) => idExpandido !== id)
    : [...hallazgosExpandidos.value, id]
}

function idPanelHallazgo(id: string | number): string {
  return `hallazgo-${id}`
}

function clasesFuncion(nombre: string): string {
  const nombreNormalizado = nombre
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()

  if (
    nombreNormalizado.includes('revisor') &&
    (nombreNormalizado.includes('traductor') || nombreNormalizado.includes('traduccion'))
  ) {
    return 'bg-warning-content text-warning'
  }
  if (nombreNormalizado.includes('elaborador')) return 'badge-primary'
  if (nombreNormalizado.includes('revisor')) return 'badge-warning'
  if (nombreNormalizado.includes('traductor')) return 'badge-secondary'

  return 'badge-outline'
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
        class="btn btn-primary btn-sm gap-2 self-start sm:self-auto"
        @click="emit('agregarHallazgo')"
      >
        <i class="fa-regular fa-plus"></i>
        Agregar hallazgo
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
        Aquí aparecerán las notas y observaciones registradas por el equipo.
      </p>
    </div>

    <!-- Listado de hallazgos -->
    <div v-else class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      <article
        v-for="hallazgo in hallazgos"
        :key="hallazgo.hallazgoId"
        class="overflow-hidden rounded-xl border border-base-200 bg-base-100 transition-colors hover:border-base-300"
      >
        <button
          type="button"
          class="flex w-full items-start gap-3 p-4 text-left transition-colors hover:bg-base-200/40 sm:p-5"
          :aria-expanded="hallazgosExpandidos.includes(hallazgo.hallazgoId)"
          :aria-controls="idPanelHallazgo(hallazgo.hallazgoId)"
          @click="alternarHallazgo(hallazgo.hallazgoId)"
        >
          <span
            class="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"
          >
            <i class="fa-regular fa-note-sticky"></i>
          </span>

          <span class="min-w-0 flex-1">
            <span class="font-semibold text-base-content">{{ hallazgo.nombre }}</span>
            <span
              class="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-base-content/60"
            >
              <span class="inline-flex items-center gap-1.5">
                <i class="fa-regular fa-user"></i>
                {{ hallazgo.propietario.nombre }} {{ hallazgo.propietario.apellidoPaterno }}
              </span>
              <span class="inline-flex items-center gap-1.5">
                <i class="fa-regular fa-calendar"></i>
                {{ formatearFecha(hallazgo.fechaCreacion) }}
              </span>
            </span>
          </span>

          <span class="mt-1 flex shrink-0 items-center gap-2">
            <span
              class="badge badge-soft h-6 w-24 justify-center truncate"
              :class="clasesFuncion(hallazgo.funcion.nombre)"
              :title="hallazgo.funcion.nombre"
            >
              {{ hallazgo.funcion.nombre }}
            </span>
            <i
              class="fa-regular text-base-content/50 transition-transform"
              :class="
                hallazgosExpandidos.includes(hallazgo.hallazgoId)
                  ? 'fa-chevron-up'
                  : 'fa-chevron-down'
              "
              aria-hidden="true"
            ></i>
          </span>
        </button>

        <div
          v-if="hallazgosExpandidos.includes(hallazgo.hallazgoId)"
          :id="idPanelHallazgo(hallazgo.hallazgoId)"
          class="border-t border-base-200 bg-base-200/30 px-4 py-4 sm:px-5 sm:py-5"
        >
          <p class="whitespace-pre-line text-sm leading-relaxed text-base-content/80">
            {{ hallazgo.descripcion }}
          </p>
          <div
            class="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-base-content/50"
          >
            <span>Reactivo: {{ hallazgo.idReactivo }}</span>
            <span>Actualizado: {{ formatearFecha(hallazgo.fechaModificacion) }}</span>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>
