<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useReactivos } from '@/api/bancos/composable/useReactivos'
import { useRespuestas } from '@/api/bancos/composable/useRespuestas'
import { useReactivoSeleccionadoStore } from './useReactivoSeleccionado'
import { useBancoNavigation } from '@/app/common/banco-navigation'
import { storeToRefs } from 'pinia'
import { useModalStore } from '@/common/modals/store/modal.store'
import eliminarReactivo from '@/app/common/components/modals/eliminarReactivo.vue'
import { useTiposReactivo } from '@/api/bancos/composable/useTiposReactivo'
import { useInstruccionesGrupos } from '@/api/bancos/composable/useInstruccionesGrupos'
import { useRespuestasGrupo } from '@/api/bancos/composable/useRespuestasGrupo'
import type { Respuesta } from '@/api/bancos/interfaces/respuesta.interface'
import type { Propietario } from '@/api/bancos/interfaces/banco.interface'
import type { Reactivo } from '@/api/bancos/interfaces/reactivo.interface'

const props = withDefaults(defineProps<{
  bancoId: string
  esProyecto?: boolean
  reactivoMostrado?: Reactivo
  idioma?: string
  cargandoIdioma?: boolean
  errorIdioma?: boolean
}>(), {
  esProyecto: false,
})

const router = useRouter()
const { routeNames } = useBancoNavigation()
const { data: reactivos, isLoading } = useReactivos(props.bancoId)
const store = useReactivoSeleccionadoStore()
const { selectedReactivo } = storeToRefs(store)
const { clear } = store
const modal = useModalStore()

const reactivoMostrado = computed(
  () => props.reactivoMostrado ?? selectedReactivo.value ?? undefined,
)

watch(reactivos, (lista) => {
  const sel = selectedReactivo.value
  if (lista && sel && !lista.some((r) => r.idReactivo === sel.idReactivo)) clear()
})

const { data: respuestas, isLoading: cargandoRespuestas, isError: errorRespuestas } = useRespuestas(
  props.bancoId,
  () => selectedReactivo.value?.idReactivo,
  () => props.idioma,
)
const tipoReactivoId = computed(
  () => reactivoMostrado.value?.tipoReactivoId ?? selectedReactivo.value?.tipoReactivoId,
)
const { tipoPorId } = useTiposReactivo()
const respuestasOrdenadas = computed(() =>
  [...(respuestas.value ?? [])].sort((a, b) => a.posicion - b.posicion),
)

// Relacional: consultar instrucciones solo al seleccionar un reactivo agrupado.
const requiereInstruccionesGrupo = computed(
  () => selectedReactivo.value?.tipoReactivoId === 5 && selectedReactivo.value.grupo > 0,
)
const { data: instrucciones } = useInstruccionesGrupos(props.bancoId, requiereInstruccionesGrupo)

const instruccionGrupo = computed(() => {
  if (!selectedReactivo.value?.grupo) return ''
  return (
    instrucciones.value?.find((i) => i.grupo === selectedReactivo.value?.grupo)?.descripcion ?? ''
  )
})

const reactivosGrupo = computed(() => {
  if (!selectedReactivo.value?.grupo) return []
  return (reactivos.value ?? [])
    .filter((r) => r.grupo === selectedReactivo.value?.grupo)
    .sort((a, b) => a.posicionGrupo - b.posicionGrupo)
})

const grupoReactivoIds = computed(() => reactivosGrupo.value.map((r) => r.idReactivo))
const { respuestasMap: respuestasGrupoMap, isLoading: cargandoRespuestasGrupo } =
  useRespuestasGrupo(props.bancoId, grupoReactivoIds)

function getRespuestasReactivo(idReactivo: string): Respuesta[] {
  return [...(respuestasGrupoMap.value.get(idReactivo) ?? [])].sort(
    (a, b) => a.posicion - b.posicion,
  )
}

function abrirEliminar() {
  if (!selectedReactivo.value) return
  modal.openModal(eliminarReactivo, { bancoId: props.bancoId, reactivo: selectedReactivo.value }, [
    { label: 'Cerrar', variant: 'outline' },
    { label: 'Eliminar', variant: 'error', type: 'submit' },
  ])
}

function irAEditar() {
  router.push({ name: routeNames.value.edit, params: { id: props.bancoId } })
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function nombreAutor(autor?: Propietario): string {
  return (
    [autor?.nombre, autor?.apellidoPaterno, autor?.apellidoMaterno].filter(Boolean).join(' ') ||
    'No disponible'
  )
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
      <div
        class="w-full"
        :class="
          props.esProyecto
            ? 'max-w-none px-4 sm:px-5 lg:px-6'
            : 'max-w-4xl'
        "
      >
        <!-- Breadcrumbs (DaisyUI) -->
        <div class="breadcrumbs text-sm mb-6">
          <ul>
            <li>
              <RouterLink class="link link-hover" :to="{ name: routeNames.home }"
                >Inicio</RouterLink
              >
            </li>
            <li>
              <RouterLink
                class="link link-hover"
                :to="{ name: routeNames.detail, params: { id: props.bancoId } }"
              >
                {{ props.esProyecto ? 'Proyecto detalle' : 'Banco detalle' }}
              </RouterLink>
            </li>
            <li class="text-base-content/60">Reactivo {{ selectedReactivo.posicion }}</li>
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
                  Reactivo {{ reactivoMostrado?.posicion ?? selectedReactivo.posicion }}
                  <!-- <span v-html="selectedReactivo.descripcion.slice(0, 50) + '...'"></span> -->
                </div>
                <div class="flex items-center gap-3 text-xs text-base-content/60">
                  <span class="flex items-center gap-1">
                    <i class="fa-regular fa-code-branch text-[14px]"></i>
                    v{{ reactivoMostrado?.version ?? selectedReactivo.version }}
                  </span>
                  <span class="w-1 h-1 rounded-full bg-base-300"></span>
                  <span>
              {{ tipoPorId(reactivoMostrado?.tipoReactivoId ?? selectedReactivo.tipoReactivoId)?.nombre ?? 'Unknown' }}
                  </span>
                  <span class="w-1 h-1 rounded-full bg-base-300"></span>
                  <span
                    class="flex items-center gap-1"
                    :class="(reactivoMostrado?.esCompleto ?? selectedReactivo.esCompleto) ? 'text-success' : 'text-error'"
                  >
                    <i
                      :class="
                        (reactivoMostrado?.esCompleto ?? selectedReactivo.esCompleto)
                          ? 'fa-solid fa-circle-check'
                          : 'fa-solid fa-circle-x'
                      "
                    ></i>
                    {{ (reactivoMostrado?.esCompleto ?? selectedReactivo.esCompleto) ? 'Completo' : 'Incompleto' }}
                  </span>
                  <slot name="datos-proyecto"></slot>
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

            <slot name="idiomas"></slot>
          </div>

          <!-- Content Area -->
          <div v-if="props.cargandoIdioma" class="p-8 space-y-4">
            <div class="skeleton h-6 w-48"></div>
            <div class="skeleton h-40 w-full rounded-xl"></div>
            <div class="skeleton h-24 w-full rounded-xl"></div>
          </div>
          <div
            v-else-if="props.errorIdioma"
            class="p-8 text-center text-sm text-error"
          >
            No se pudo cargar el reactivo en {{ props.idioma }}.
          </div>
          <div v-else-if="reactivoMostrado" class="p-8 space-y-8">
            <!-- Description / Question Stem -->
            <div v-if="tipoReactivoId !== 5" class="space-y-3">
              <h3
                class="text-xs font-bold uppercase tracking-wider text-base-content/60 flex items-center gap-2"
              >
                <i class="fa-regular fa-file-lines text-[14px]"></i>
                Descripción / Enunciado
              </h3>
              <div class="bg-base-200 rounded-xl p-6">
                <div
                  class="fr-view text-lg text-base-content leading-relaxed [&_p]:m-0"
                  v-html="reactivoMostrado.descripcion"
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
              <p v-else-if="errorRespuestas" class="text-sm text-error">
                No se pudieron cargar las respuestas en {{ props.idioma ?? 'el idioma original' }}.
              </p>
              <div v-else-if="respuestasOrdenadas.length" class="space-y-2">
                <div v-for="(r, i) in respuestasOrdenadas" :key="r.idRespuesta">
                  <div
                    class="flex items-center gap-3 p-4 rounded-xl border"
                    :class="
                      r.esCorrecta
                        ? 'border-success bg-success/10'
                        : 'border-base-300 bg-base-200/50'
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
              <p v-else-if="errorRespuestas" class="text-sm text-error">
                No se pudieron cargar las respuestas en {{ props.idioma ?? 'el idioma original' }}.
              </p>
              <div
                v-else-if="respuestasOrdenadas.length"
                class="grid grid-cols-1 sm:grid-cols-2 gap-3"
              >
                <div v-for="r in respuestasOrdenadas" :key="r.idRespuesta">
                  <div
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
              </div>
              <p v-else class="text-sm text-base-content/40">Sin respuestas guardadas</p>
            </div>

            <!-- Relacional: Instrucción + tabla de reactivos -->
            <div v-else-if="tipoReactivoId === 5" class="space-y-6">
              <!-- Instrucción del grupo -->
              <div class="space-y-3">
                <h3
                  class="text-xs font-bold uppercase tracking-wider text-base-content/60 flex items-center gap-2"
                >
                  <i class="fa-regular fa-arrow-right-arrow-left text-[14px]"></i>
                  Instrucción del grupo
                </h3>
                <div class="bg-base-200 rounded-xl p-6">
                  <div
                    class="fr-view text-lg text-base-content leading-relaxed [&_p]:m-0"
                    v-html="instruccionGrupo || '<em>Sin instrucción</em>'"
                  ></div>
                </div>
              </div>

              <!-- Tabla de reactivos del grupo -->
              <div class="space-y-3">
                <h3
                  class="text-xs font-bold uppercase tracking-wider text-base-content/60 flex items-center gap-2"
                >
                  <i class="fa-regular fa-list text-[14px]"></i>
                  Reactivos del grupo
                </h3>

                <div v-if="cargandoRespuestasGrupo" class="space-y-2">
                  <div class="skeleton h-12 w-full rounded-xl"></div>
                  <div class="skeleton h-12 w-full rounded-xl"></div>
                </div>

                <div v-else-if="reactivosGrupo.length" class="overflow-x-auto">
                  <table class="table table-bordered table-fixed w-full">
                    <thead>
                      <tr>
                        <th
                          class="bg-base-200 text-xs font-semibold uppercase tracking-wider w-[40%]"
                        >
                          <span class="flex items-center gap-2">
                            <i class="fa-regular fa-pen-to-square text-[14px]"></i>
                            Reactivo
                          </span>
                        </th>
                        <th
                          class="bg-base-200 text-xs font-semibold uppercase tracking-wider w-[60%]"
                        >
                          <span class="flex items-center gap-2">
                            <i class="fa-regular fa-circle-check text-[14px]"></i>
                            Respuestas
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="reactivo in reactivosGrupo" :key="reactivo.idReactivo">
                        <td>
                          <div
                            class="fr-view min-w-0 text-sm text-base-content leading-relaxed wrap-anywhere [&_p]:m-0"
                            v-html="reactivo.descripcion"
                          ></div>
                        </td>
                        <td>
                          <div class="space-y-1.5">
                            <div
                              v-for="(r, i) in getRespuestasReactivo(reactivo.idReactivo)"
                              :key="r.idRespuesta"
                              class="flex items-center gap-2 text-sm"
                            >
                              <span
                                class="size-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                                :class="
                                  r.esCorrecta
                                    ? 'bg-success text-success-content'
                                    : 'bg-base-300 text-base-content/60'
                                "
                              >
                                {{ r.esCorrecta ? '✓' : String.fromCharCode(65 + i) }}
                              </span>
                              <span
                                class="fr-view min-w-0 flex-1 wrap-anywhere [&_p]:m-0"
                                :class="
                                  r.esCorrecta ? 'text-success font-medium' : 'text-base-content'
                                "
                                v-html="r.respuesta"
                              ></span>
                            </div>
                            <p
                              v-if="!getRespuestasReactivo(reactivo.idReactivo).length"
                              class="text-xs text-base-content/40 italic"
                            >
                              Sin respuestas
                            </p>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p v-else class="text-sm text-base-content/40">Sin reactivos en el grupo</p>
              </div>
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
                    {{ tipoPorId(selectedReactivo.tipoReactivoId)?.nombre ?? 'Unknown' }}
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
                    {{ fmtDate(reactivoMostrado?.fechaCreacion ?? selectedReactivo.fechaCreacion) }}
                  </p>
                  <p
                    class="max-w-48 truncate text-[10px] text-base-content/60"
                    :title="`Creado por ${nombreAutor(reactivoMostrado?.creadoPor ?? selectedReactivo.creadoPor)}`"
                  >
                    Por {{ nombreAutor(reactivoMostrado?.creadoPor ?? selectedReactivo.creadoPor) }}
                  </p>
                </div>
                <div class="text-right">
                  <p class="text-[10px] uppercase tracking-wider text-base-content/40">
                    Modificado
                  </p>
                  <p class="text-base-content font-medium">
                    {{ fmtDate(reactivoMostrado?.fechaModificacion ?? selectedReactivo.fechaModificacion) }}
                  </p>
                  <p
                    class="max-w-48 truncate text-[10px] text-base-content/60"
                    :title="`Modificado por ${nombreAutor(reactivoMostrado?.modificadoPor ?? selectedReactivo.modificadoPor)}`"
                  >
                    Por {{ nombreAutor(reactivoMostrado?.modificadoPor ?? selectedReactivo.modificadoPor) }}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <div class="text-right">
                  <p class="text-[10px] uppercase tracking-wider text-base-content/40">ID</p>
                  <p class="text-base-content font-medium font-mono text-xs">
                    {{ reactivoMostrado?.idReactivo ?? selectedReactivo.idReactivo }}
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
