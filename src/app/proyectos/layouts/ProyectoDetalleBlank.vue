<script setup lang="ts">
import { computed } from 'vue'
import type { ProyectoDetalle } from '@/api/proyectos/interfaces/proyecto.interface'
import FlujoDeTrabajo from '@/app/proyectos/components/FlujoDeTrabajo.vue'
import ListaMiembrosProyecto from '@/app/proyectos/components/ListaMiembrosProyecto.vue'
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
  modal.openModal(EditarProyecto, { proyecto: props.proyecto }, [
    { label: 'Cancelar', variant: 'outline' },
    { label: 'Guardar', variant: 'primary', type: 'submit' },
  ])
}
</script>

<template>
  <div class="h-full">
    <main
      class="mx-auto flex h-full max-w-9xl flex-col space-y-5 px-4 py-5 sm:px-6 sm:py-8 lg:px-8 short:py-3"
    >
      <div
        class="grid min-h-0 flex-1 grid-cols-1 items-stretch gap-4 short:gap-2 md:grid-cols-6 xl:grid-cols-[repeat(4,minmax(0,3fr))_minmax(0,4fr)] xl:grid-rows-[auto_auto_repeat(4,minmax(0,1fr))] xl:gap-5"
      >
        <header
          class="card col-span-full bg-base-100 p-6 shadow-sm md:col-span-6 xl:col-start-1 xl:col-span-4 xl:row-start-1"
        >
          <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div class="flex min-w-0 max-w-3xl flex-col gap-1 font-hanken">
              <div class="mb-1 flex flex-wrap items-center gap-2 text-[11px] leading-3.5">
                <img
                  v-for="idioma in idiomasSinEspanol"
                  :key="idioma.etiqueta"
                  :src="BANDERAS[idioma.etiqueta]"
                  :alt="idioma.descripcion"
                  :title="idioma.descripcion"
                  class="h-4 w-6 object-contain"
                />
                <span
                  class="inline-flex items-center gap-2 rounded-full px-2 py-0.5 font-semibold uppercase tracking-[0.04em] ring-1 ring-inset"
                  :class="
                    proyecto.estado.nombre === 'En Proceso'
                      ? 'bg-primary/10 text-primary ring-primary/30'
                      : 'bg-success/10 text-success ring-success/30'
                  "
                >
                  <span
                    :class="
                      proyecto.estado.nombre === 'En Proceso'
                        ? 'status status-info animate-spin'
                        : 'status status-success'
                    "
                  ></span>
                  {{ proyecto.estado.nombre }}
                </span>
              </div>

              <div class="flex flex-wrap items-center gap-3">
                <h1 class="text-[28px] leading-9 font-bold tracking-[-0.015em] wrap-break-word">
                  {{ proyecto.nombre }}
                </h1>
                <span
                  class="inline-flex items-center rounded-full border border-base-300 bg-base-200 px-2 py-0.5 text-[11px] leading-3.5 font-semibold uppercase tracking-[0.04em] text-base-content/70"
                >
                  Proyecto
                </span>
              </div>

              <p
                v-if="proyecto.descripcion"
                class="mt-0.5 max-w-3xl text-sm leading-5 text-base-content/70"
              >
                {{ proyecto.descripcion }}
              </p>
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

        <FlujoDeTrabajo
          :fases="proyecto.fases"
          orientacion="auto"
          class="md:col-span-3 md:min-h-0 xl:col-start-1 xl:col-span-4 xl:row-start-2"
        />

        <ListaMiembrosProyecto
          :id-proyecto="proyecto.idProyecto"
          :propietario="proyecto.propietario"
          class="md:col-span-6 xl:col-start-5 xl:col-span-1 xl:row-start-1 xl:row-span-6"
        />

        <section
          class="card min-h-56 border border-base-300 bg-base-100 p-5 sm:p-6 short:p-3 md:col-span-6 md:min-h-0 xl:col-start-1 xl:col-span-4 xl:row-start-3 xl:row-span-4"
        >
          <div class="flex items-center gap-2.5 border-b border-base-200 pb-2">
            <div class="rounded-lg bg-primary/10 p-2 text-primary">
              <i class="fa-regular fa-comments"></i>
            </div>
            <h2 class="text-xs font-bold uppercase tracking-wider sm:text-sm">
              Comentarios y observaciones
            </h2>
          </div>

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
