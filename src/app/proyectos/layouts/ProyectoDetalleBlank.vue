<script setup lang="ts">
import { computed } from 'vue'
import type { Fase, ProyectoDetalle } from '@/api/proyectos/interfaces/proyecto.interface'
import banderaUs from '@/assets/banderas/us.png'
import banderaFr from '@/assets/banderas/fr.png'

const props = defineProps<{
  proyecto: ProyectoDetalle
}>()

type EstadoFase = 'completada' | 'en_proceso' | 'pendiente'

const ICONOS_FASE: Record<string, string> = {
  Construcción: 'fa-solid fa-screwdriver-wrench',
  Revision: 'fa-solid fa-magnifying-glass',
  Traduccion: 'fa-solid fa-language',
  'Revision Traduccion': 'fa-solid fa-comments',
  Finalizado: 'fa-solid fa-flag',
}

function getEstadoFase(fase: Fase): EstadoFase {
  if (fase.estado === 'Completada') return 'completada'
  if (fase.estado === 'En proceso') return 'en_proceso'
  return 'pendiente'
}

const fases = computed(() =>
  props.proyecto.fases.map((fase) => ({
    nombre: fase.nombre,
    icono: ICONOS_FASE[fase.nombre] ?? 'fa-solid fa-circle',
    estado: getEstadoFase(fase),
    estadoTexto: fase.estado,
  })),
)

const BANDERAS: Record<string, string> = {
  en_US: banderaUs,
  fr_FR: banderaFr,
}

const idiomasSinEspanol = computed(() =>
  props.proyecto.idiomas.filter((idioma) => idioma.etiqueta !== 'es_MX'),
)

const iniciales = computed(() => {
  const { nombre, apellidoPaterno } = props.proyecto.propietario
  return `${nombre.charAt(0)}${apellidoPaterno.charAt(0)}`.toUpperCase()
})

const nombrePropietario = computed(() => {
  const { nombre, apellidoPaterno, apellidoMaterno } = props.proyecto.propietario
  return `${nombre} ${apellidoPaterno} ${apellidoMaterno}`
})
</script>

<template>
  <div class="min-h-full">
    <main class="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-5">
      <!--
        Grid base: 1 columna en móvil, 6 en tablet y 12 en escritorio.
        En xl hay tres filas: encabezado y dos filas de contenido.
        Ajusta col-start, col-span, row-start y row-end para mover o dimensionar cada card.
      -->
      <div
        class="grid grid-cols-1 md:grid-cols-6 xl:grid-cols-12 xl:grid-rows-[auto_minmax(12rem,auto)_minmax(12rem,auto)] gap-4 xl:gap-5 items-stretch"
      >
        <!-- Encabezado: fila 1. -->
        <header
          class="card min-h-32 border border-base-300 bg-base-100 col-span-full xl:row-start-1 xl:col-span-9 p-5 sm:p-6"
        >
          <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div class="min-w-0 space-y-3">
              <div class="flex flex-wrap items-center gap-3">
                <h1 class="text-2xl sm:text-3xl font-bold tracking-tight wrap-break-word">
                  {{ proyecto.nombre }}
                </h1>
                <span
                  class="inline-flex items-center rounded-full border border-base-300 bg-base-200 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-base-content/70"
                >
                  Proyecto
                </span>
              </div>

              <p v-if="proyecto.descripcion" class="max-w-3xl text-sm text-base-content/70">
                {{ proyecto.descripcion }}
              </p>

              <div class="flex flex-wrap items-center gap-3 text-xs text-base-content/60">
                <img
                  v-for="idioma in idiomasSinEspanol"
                  :key="idioma.etiqueta"
                  :src="BANDERAS[idioma.etiqueta]"
                  :alt="idioma.descripcion"
                  :title="idioma.descripcion"
                  class="h-4 w-6 object-contain"
                />
                <span
                  class="inline-flex items-center gap-2 rounded-full px-2.5 py-1 font-medium ring-1 ring-inset"
                  :class="
                    proyecto.estado.nombre === 'En Proceso'
                      ? 'bg-primary/10 text-primary ring-primary/30'
                      : 'bg-success/10 text-success ring-success/30'
                  "
                >
                  <div
                    :class="
                      proyecto.estado.nombre === 'En Proceso'
                        ? 'status status-info animate-spin'
                        : 'status status-success'
                    "
                  ></div>
                  {{ proyecto.estado.nombre }}
                </span>
              </div>
            </div>

            <div class="flex flex-wrap gap-2">
              <button
                type="button"
                disabled
                title="Disponible próximamente"
                class="btn btn-sm btn-outline rounded-full"
              >
                <i class="fa-regular fa-user-group"></i>
                Miembros
              </button>
              <button
                type="button"
                disabled
                title="Disponible próximamente"
                class="btn btn-sm btn-outline rounded-full"
              >
                <i class="fa-regular fa-comment-plus"></i>
                Agregar observación
              </button>
              <button
                type="button"
                disabled
                title="Disponible próximamente"
                class="btn btn-sm btn-neutral rounded-full"
              >
                <i class="fa-regular fa-paper-plane"></i>
                Solicitar revisión
              </button>
            </div>
          </div>
        </header>

        <!-- Card 1: reactivos, fila 2. -->
        <section
          class="card min-h-72 border border-base-300 bg-base-100 md:col-span-3 xl:col-start-1 xl:col-span-4 xl:row-start-2 p-5 sm:p-6"
        >
          <div class="flex items-center justify-between">
            <h2 class="text-sm font-bold uppercase tracking-wider">Reactivos</h2>
            <span class="badge badge-outline">{{ proyecto.cantidadReactivos }}</span>
          </div>

          <div
            class="mt-6 flex flex-1 items-center justify-center text-center text-sm text-base-content/60"
          >
            {{ proyecto.cantidadReactivos }}
            {{ proyecto.cantidadReactivos === 1 ? 'reactivo' : 'reactivos' }} en este proyecto
          </div>

          <button
            type="button"
            disabled
            title="Disponible próximamente"
            class="mt-4 w-full rounded-2xl border-2 border-dashed border-base-300 py-4 text-sm font-semibold text-base-content/60"
          >
            <i class="fa-regular fa-plus"></i>
            Crear reactivo
          </button>
        </section>

        <!-- Card 2: flujo de trabajo, columna derecha y filas 1-3. -->
        <section
          class="card flex h-full min-h-72 flex-col border border-base-300 bg-base-100 md:col-span-3 xl:col-start-10 xl:col-span-3 xl:row-start-1 xl:row-end-4"
        >
          <div class="flex h-full flex-1 flex-col p-4 sm:p-5">
            <h2 class="text-center text-sm font-bold uppercase tracking-wider">Flujo de trabajo</h2>
            <div class="mt-5 flex min-h-0 flex-1 items-center justify-center">
              <ol class="relative w-full max-w-xs">
                <div
                  aria-hidden="true"
                  class="absolute left-5 top-5 bottom-5 w-px bg-base-300"
                ></div>

                <li
                  v-for="fase in fases"
                  :key="fase.nombre"
                  class="relative flex items-center gap-4 pb-8 last:pb-0"
                  :aria-current="fase.estado === 'en_proceso' ? 'step' : undefined"
                >
                  <span
                    class="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full font-bold"
                    :class="{
                      'bg-success text-success-content shadow-lg shadow-success/30':
                        fase.estado === 'completada',
                      'bg-primary text-primary-content shadow-lg shadow-primary/30':
                        fase.estado === 'en_proceso',
                      'border border-base-300 bg-base-200 text-base-content/50':
                        fase.estado === 'pendiente',
                    }"
                  >
                    <i :class="fase.icono"></i>
                  </span>

                  <div class="flex flex-col">
                    <span
                      class="text-sm font-bold"
                      :class="{
                        'text-success': fase.estado === 'completada',
                        'text-primary': fase.estado === 'en_proceso',
                        'text-base-content/50': fase.estado === 'pendiente',
                      }"
                    >
                      {{ fase.nombre }}
                    </span>
                    <span
                      class="text-xs font-medium"
                      :class="{
                        'text-success': fase.estado === 'completada',
                        'text-primary': fase.estado === 'en_proceso',
                        'text-base-content/50': fase.estado === 'pendiente',
                      }"
                    >
                      {{ fase.estadoTexto }}
                    </span>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </section>

        <!-- Card 3: miembros, fila 2. -->
        <section
          class="card min-h-72 border border-base-300 bg-base-100 md:col-span-6 xl:col-start-5 xl:col-span-5 xl:row-start-2 p-5 sm:p-6"
        >
          <h2 class="text-sm font-bold uppercase tracking-wider">Miembros</h2>

          <div
            class="mt-6 flex items-center gap-3 rounded-2xl border border-base-200 bg-base-200/50 p-3"
          >
            <div
              class="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-content"
            >
              {{ iniciales }}
            </div>
            <div class="min-w-0">
              <p class="truncate text-sm font-semibold" :title="nombrePropietario">
                {{ nombrePropietario }}
              </p>
              <p class="text-xs text-base-content/60">Propietario</p>
            </div>
          </div>
        </section>

        <!-- Card 4: comentarios y observaciones, fila 3. -->
        <section
          class="card min-h-56 border border-base-300 bg-base-100 md:col-span-6 xl:col-start-1 xl:col-span-9 xl:row-start-3 p-5 sm:p-6"
        >
          <h2 class="text-sm font-bold uppercase tracking-wider">Comentarios y observaciones</h2>

          <div class="mt-5 flex gap-4 overflow-x-auto pb-2">
            <p v-if="!proyecto.hallazgos" class="self-center text-sm text-base-content/60">
              Aún no hay comentarios en este proyecto.
            </p>

            <button
              type="button"
              disabled
              title="Disponible próximamente"
              class="flex min-w-56 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-base-300 p-6 text-sm font-semibold text-base-content/60"
            >
              <i class="fa-regular fa-circle-plus text-2xl"></i>
              Nuevo comentario
            </button>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>
