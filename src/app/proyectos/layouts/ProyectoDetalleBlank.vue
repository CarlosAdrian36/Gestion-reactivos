<script setup lang="ts">
import { computed } from 'vue'
import type { ProyectoDetalle } from '@/api/proyectos/interfaces/proyecto.interface'
import FlujoDeTrabajo from '@/app/proyectos/components/FlujoDeTrabajo.vue'
import ListaMiembrosProyecto from '@/app/proyectos/components/ListaMiembrosProyecto.vue'
import ListaReactivosProyecto from '@/app/proyectos/components/ListaReactivosProyecto.vue'
import EditarProyecto from '@/app/common/components/modals/editarProyecto.vue'
import { useAuthStore } from '@/auth/store/auth.store'
import { useModalStore } from '@/common/modals/store/modal.store'
import banderaUs from '@/assets/banderas/us.png'
import banderaFr from '@/assets/banderas/fr.png'

const props = defineProps<{
  proyecto: ProyectoDetalle
}>()

const authStore = useAuthStore()
const modal = useModalStore()

const BANDERAS: Record<string, string> = {
  en_US: banderaUs,
  fr_FR: banderaFr,
}

const idiomasSinEspanol = computed(() =>
  props.proyecto.idiomas.filter((idioma) => idioma.etiqueta !== 'es_MX'),
)

function abrirModalEditarProyecto(): void {
  modal.openModal(
    EditarProyecto,
    { proyecto: props.proyecto },
    [
      { label: 'Cancelar', variant: 'outline' },
      { label: 'Guardar', variant: 'primary', type: 'submit' },
    ],
  )
}
</script>

<template>
  <div class="h-full">
    <main
      class="mx-auto flex h-full max-w-9xl flex-col space-y-5 px-4 py-5 sm:px-6 sm:py-8 lg:px-8 short:py-3"
    >
      <!--
        Grid base: 1 columna en móvil, 6 en tablet y 12 en escritorio.
        Ocupa toda la altura disponible del área de contenido (main h-full + grid flex-1),
        así las filas se reparten el alto y no se genera scroll.
        En xl hay 6 filas (prueba): la 1 y la 6 son `auto` (encabezado y comentarios
        miden su contenido) y las 4 del medio son flexibles (reactivos y miembros).
        Ajusta col-start, col-span, row-start y row-end para mover o dimensionar cada card.
      -->
      <div
        class="grid min-h-0 flex-1 grid-cols-1 gap-4 md:grid-cols-6 xl:grid-cols-12 xl:grid-rows-[auto_repeat(4,minmax(0,1fr))_auto] xl:gap-5 items-stretch short:gap-2"
      >
        <!-- Encabezado: fila 1. -->
        <header
          class="card min-h-32 border border-base-300 bg-base-100 col-span-full md:min-h-0 xl:row-start-1 xl:col-span-9 p-5 sm:p-6 short:p-3"
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
                v-if="authStore.esAdministrador"
                type="button"
                class="btn btn-sm btn-primary rounded-full"
                @click="abrirModalEditarProyecto"
              >
                <i class="fa-regular fa-pen"></i>
                Editar
              </button>
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

        <!-- Card Reactivos: columnas 1-4, fila 2. -->
        <ListaReactivosProyecto
          :id-proyecto="proyecto.idProyecto"
          :total="proyecto.cantidadReactivos"
          class="md:col-span-3 xl:col-start-1 xl:col-span-4 xl:row-start-2 xl:row-end-6"
        />

        <!-- Card 2: flujo de trabajo, columna derecha y filas 1-3. -->
        <FlujoDeTrabajo
          :fases="proyecto.fases"
          class="md:col-span-3 md:min-h-0 xl:col-start-10 xl:col-span-3 xl:row-start-1 xl:row-end-7"
        />

        <!-- Card Miembros: columnas 5-9, filas 2-5. -->
        <ListaMiembrosProyecto
          :id-proyecto="proyecto.idProyecto"
          :propietario="proyecto.propietario"
          class="md:col-span-6 xl:col-start-5 xl:col-span-5 xl:row-start-2 xl:row-end-6"
        />

        <!-- Card 4: comentarios y observaciones, fila 3. -->
        <section
          class="card min-h-56 border border-base-300 bg-base-100 md:col-span-6 md:min-h-0 xl:col-start-1 xl:col-span-9 xl:row-start-6 p-5 sm:p-6 short:p-3"
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
