<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useReactivos } from '@/api/bancos/composable/useReactivos'
import { useRespuestas } from '@/api/bancos/composable/useRespuestas'
import { useReactivosStore } from './reactivosStore'
import { useModalStore } from '@/common/modals/store/modal.store'
import eliminarReactivo from '@/app/common/components/modals/eliminarReactivo.vue'

const route = useRoute()
const router = useRouter()
const bancoId = String(route.params.id)
const { isLoading } = useReactivos(bancoId)
const { selectedReactivo } = useReactivosStore()
const modal = useModalStore()

const { data: respuestas, isLoading: cargandoRespuestas } = useRespuestas(
  bancoId,
  () => selectedReactivo.value?.idReactivo,
)

const tipoReactivoId = computed(() => selectedReactivo.value?.tipoReactivoId)
const respuestasOrdenadas = computed(() =>
  [...(respuestas.value ?? [])].sort((a, b) => a.posicion - b.posicion),
)

function abrirEliminar() {
  if (!selectedReactivo.value) return
  modal.openModal(eliminarReactivo, { bancoId, reactivo: selectedReactivo.value }, [
    { label: 'Cerrar', variant: 'outline' },
    { label: 'Eliminar', variant: 'error', type: 'submit' },
  ])
}

function irAEditar() {
  router.push({ name: 'editarReactivo', params: { id: bancoId } })
}

const idiomas: Record<number, string> = {
  1: 'Original (EN)',
  2: 'v1: Es-MX',
  3: 'v2: Fr-CA',
}

const tipoReactivo: Record<number, string> = {
  1: 'Opción Múltiple',
  2: 'Respuesta Múltiple',
  3: 'Verdadero / Falso',
  4: 'Pregunta Abierta',
  5: 'Relacional',
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>

<template>
  <div class="min-h-full flex justify-center">
    <template v-if="isLoading">
      <div class="w-full max-w-4xl space-y-4">
        <div class="skeleton h-8 w-96"></div>
        <div class="skeleton h-150 w-full rounded-2xl"></div>
      </div>
    </template>

    <template v-else-if="selectedReactivo">
      <div class="w-full max-w-4xl">
        <!-- Breadcrumbs (DaisyUI) -->
        <div class="breadcrumbs text-sm mb-6">
          <ul>
            <li>
              <RouterLink class="link link-hover" :to="{ name: 'misBancos' }">Inicio</RouterLink>
            </li>
            <li>
              <RouterLink
                class="link link-hover"
                :to="{ name: 'bancoDetalle', params: { id: bancoId } }"
                >Banco Detalle</RouterLink
              >
            </li>
            <li class="text-base-content/60">#{{ selectedReactivo.posicion }}</li>
          </ul>
        </div>

        <!-- Detail Card -->
        <div class="bg-base-100 rounded-box border border-base-300 flex flex-col min-h-150">
          <!-- Card Header -->
          <div class="px-8 pt-8 pb-0">
            <div class="flex justify-between items-start mb-6">
              <div>
                <div
                  class="text-2xl font-bold text-base-content tracking-tight mb-1 [&_p]:inline [&_p]:m-0"
                >
                  #{{ selectedReactivo.posicion }}
                  <!-- <span v-html="selectedReactivo.descripcion.slice(0, 50) + '...'"></span> -->
                </div>
                <div class="flex items-center gap-3 text-xs text-base-content/60">
                  <span class="flex items-center gap-1">
                    <i class="fa-regular fa-code-branch text-[14px]"></i>
                    v{{ selectedReactivo.version }}
                  </span>
                  <span class="w-1 h-1 rounded-full bg-base-300"></span>
                  <span>{{ tipoReactivo[selectedReactivo.tipoReactivoId] || 'Unknown' }}</span>
                </div>
              </div>
              <div class="flex gap-2">
                <!-- <button
                  class="btn btn-xs btn-ghost gap-1.5 text-xs font-medium hover:bg-base-200 transition-colors"
                >
                  <i class="fa-regular fa-pen-to-square text-[12px]"></i>
                  Editar
                </button> -->
                <button
                  class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-base-300 text-xs font-medium text-base-content hover:bg-base-200 transition-colors cursor-pointer"
                  @click="irAEditar"
                >
                  <i class="fa-regular fa-pen-to-square text-[14px]"></i>
                  Editar
                </button>
                <button
                  class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-error text-error-content text-xs font-bold hover:bg-primary-dark transition-colors shadow-sm cursor-pointer"
                  @click="abrirEliminar"
                >
                  <i class="fa-regular fa-trash"></i>
                  Eliminar
                </button>
              </div>
            </div>

            <!-- Tabs -->
            <!-- <div class="w-full border-b border-base-300">
              <div class="flex gap-6">
                <button
                  :class="
                    idiomas[selectedReactivo.idioma.idiomaId] === 'Original (EN)'
                      ? 'relative px-1 pb-4 text-sm font-bold text-primary'
                      : 'group relative px-1 pb-4 text-sm font-medium text-base-content/60 hover:text-base-content transition-colors'
                  "
                >
                  <span class="flex items-center gap-2">Original (EN)</span>
                  <span
                    v-if="idiomas[selectedReactivo.idioma.idiomaId] === 'Original (EN)'"
                    class="absolute bottom-0 left-0 w-full h-0.5 bg-primary"
                  ></span>
                </button>
                <button
                  :class="
                    idiomas[selectedReactivo.idioma.idiomaId] === 'v1: Es-MX'
                      ? 'relative px-1 pb-4 text-sm font-bold text-primary'
                      : 'group relative px-1 pb-4 text-sm font-medium text-base-content/60 hover:text-base-content transition-colors'
                  "
                >
                  <span class="flex items-center gap-2">
                    v1: Es-MX
                    <span class="w-2 h-2 rounded-full bg-amber-400"></span>
                  </span>
                  <span
                    v-if="idiomas[selectedReactivo.idioma.idiomaId] === 'v1: Es-MX'"
                    class="absolute bottom-0 left-0 w-full h-0.5 bg-primary"
                  ></span>
                </button>
                <button
                  class="ml-auto px-2 pb-4 text-base-content/60 hover:text-primary transition-colors cursor-pointer"
                >
                  <i class="fa-regular fa-circle-plus text-[20px]"></i>
                </button>
              </div>
            </div> -->
          </div>

          <!-- Content Area -->
          <div class="p-8 space-y-8">
            <!-- Description / Question Stem -->
            <div class="space-y-3">
              <h3
                class="text-xs font-bold uppercase tracking-wider text-base-content/60 flex items-center gap-2"
              >
                <i class="fa-regular fa-file-lines text-[14px]"></i>
                Descripción / Enunciado
              </h3>
              <div class="bg-base-200 rounded-xl p-6">
                <div
                  class="fr-view text-lg text-base-content leading-relaxed [&_p]:m-0"
                  v-html="selectedReactivo.descripcion"
                ></div>
              </div>
            </div>

            <!-- Respuestas: Opción Múltiple / Respuesta Múltiple -->
            <div v-if="tipoReactivoId === 1 || tipoReactivoId === 2" class="space-y-3">
              <h3
                class="text-xs font-bold uppercase tracking-wider text-base-content/60 flex items-center gap-2"
              >
                <i class="fa-regular fa-list-check text-[14px]"></i>
                Respuestas
              </h3>
              <div v-if="cargandoRespuestas" class="space-y-2">
                <div class="skeleton h-12 w-full rounded-xl"></div>
                <div class="skeleton h-12 w-full rounded-xl"></div>
              </div>
              <div v-else-if="respuestasOrdenadas.length" class="space-y-2">
                <div
                  v-for="(r, i) in respuestasOrdenadas"
                  :key="r.idRespuesta"
                  class="flex items-center gap-3 p-4 rounded-xl border"
                  :class="
                    r.esCorrecta ? 'border-success bg-success/10' : 'border-base-300 bg-base-200/50'
                  "
                >
                  <span
                    class="size-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    :class="
                      r.esCorrecta
                        ? 'bg-success text-success-content'
                        : 'bg-base-300 text-base-content/60'
                    "
                  >
                    {{ r.esCorrecta ? '✓' : String.fromCharCode(65 + i) }}
                  </span>
                  <div
                    class="fr-view min-w-0 flex-1 text-sm text-base-content leading-relaxed [&_p]:m-0"
                    v-html="r.respuesta"
                  ></div>
                </div>
              </div>
              <p v-else class="text-sm text-base-content/40">Sin respuestas guardadas</p>
            </div>

            <!-- Respuestas: Verdadero / Falso -->
            <div v-else-if="tipoReactivoId === 3" class="space-y-3">
              <h3
                class="text-xs font-bold uppercase tracking-wider text-base-content/60 flex items-center gap-2"
              >
                <i class="fa-regular fa-toggle-on text-[14px]"></i>
                Respuestas
              </h3>
              <div v-if="cargandoRespuestas" class="skeleton h-14 w-full rounded-xl"></div>
              <div
                v-else-if="respuestasOrdenadas.length"
                class="grid grid-cols-1 sm:grid-cols-2 gap-3"
              >
                <div
                  v-for="r in respuestasOrdenadas"
                  :key="r.idRespuesta"
                  class="flex items-center gap-2 px-6 py-4 rounded-xl border"
                  :class="
                    r.esCorrecta
                      ? 'border-success bg-success/10 text-success'
                      : 'border-base-300 bg-base-200/50 text-base-content/70'
                  "
                >
                  <i
                    :class="r.esCorrecta ? 'fa-solid fa-circle-check' : 'fa-regular fa-circle'"
                  ></i>
                  <span class="font-semibold">{{ r.respuesta }}</span>
                </div>
              </div>
              <p v-else class="text-sm text-base-content/40">Sin respuestas guardadas</p>
            </div>

            <!-- Details Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Cognitive Level -->
              <!-- <div class="space-y-2">
                <h3
                  class="text-xs font-bold uppercase tracking-wider text-base-content/60 flex items-center gap-2"
                >
                  <i class="fa-regular fa-brain text-[14px]"></i>
                  Cognitive Level
                </h3>
                <div class="bg-base-200 rounded-xl p-4">
                  <p class="font-semibold text-base-content">
                    {{ selectedReactivo.nivelCognitivo.descripcion }}
                  </p>
                  <p class="text-xs text-base-content/60 mt-1">
                    ID: {{ selectedReactivo.nivelCognitivo.nivelCognitivoId }}
                  </p>
                </div>
              </div> -->

              <!-- Subject -->
              <!-- <div class="space-y-2">
                <h3
                  class="text-xs font-bold uppercase tracking-wider text-base-content/60 flex items-center gap-2"
                >
                  <i class="fa-regular fa-book text-[14px]"></i>
                  Subject
                </h3>
                <div class="bg-base-200 rounded-xl p-4">
                  <p class="font-semibold text-base-content">
                    {{ selectedReactivo.subTema.descripcion }}
                  </p>
                  <p class="text-xs text-base-content/60 mt-1">
                    ID: {{ selectedReactivo.subTema.subTemaId }}
                  </p>
                </div>
              </div> -->
            </div>

            <!-- Metadata Footer -->
            <div
              class="pt-6 border-t border-base-300 flex items-center justify-between text-xs text-base-content/60"
            >
              <!-- <div class="flex gap-6">
                <div class="flex flex-col gap-1">
                  <span class="uppercase tracking-wider font-semibold">Version</span>
                  <span
                    class="px-2 py-0.5 bg-base-300 rounded text-base-content font-mono font-medium"
                  >
                    v{{ selectedReactivo.version }}
                  </span>
                </div>
                <div class="flex flex-col gap-1">
                  <span class="uppercase tracking-wider font-semibold">Type</span>
                  <span class="px-2 py-0.5 bg-base-300 rounded text-base-content font-medium">
                    {{ tipoReactivo[selectedReactivo.tipoReactivoId] || 'Unknown' }}
                  </span>
                </div>
                <div class="flex flex-col gap-1">
                  <span class="uppercase tracking-wider font-semibold">Language</span>
                  <span class="px-2 py-0.5 bg-base-300 rounded text-base-content font-medium">
                    {{ idiomas[selectedReactivo.idioma.idiomaId] || 'Unknown' }}
                  </span>
                </div>
              </div> -->
              <div class="flex items-center gap-4">
                <div class="text-right">
                  <p class="text-[10px] uppercase tracking-wider text-base-content/40">Creado</p>
                  <p class="text-base-content font-medium">
                    {{ fmtDate(selectedReactivo.fechaCreacion) }}
                  </p>
                </div>
                <div class="text-right">
                  <p class="text-[10px] uppercase tracking-wider text-base-content/40">
                    Modificado
                  </p>
                  <p class="text-base-content font-medium">
                    {{ fmtDate(selectedReactivo.fechaModificacion) }}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <div class="text-right">
                  <p class="text-[10px] uppercase tracking-wider text-base-content/40">ID</p>
                  <p class="text-base-content font-medium font-mono text-xs">
                    {{ selectedReactivo.idReactivo }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="h-10"></div> -->
      </div>
    </template>

    <template v-else>
      <div class="flex items-center justify-center h-full">
        <div class="text-center py-16">
          <div
            class="size-20 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-5"
          >
            <i class="fa-regular fa-hand-pointer text-4xl"></i>
          </div>
          <h3 class="font-bold text-lg text-base-content">Selecciona un reactivo</h3>
          <p class="text-sm text-base-content/60 mt-2">
            Elige un reactivo de la barra lateral para ver sus detalles.
          </p>
        </div>
      </div>
    </template>
  </div>
</template>
