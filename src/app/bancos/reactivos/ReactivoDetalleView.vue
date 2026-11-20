<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useReactivos } from '@/api/bancos/composable/useReactivos'
import { useRespuestas } from '@/api/bancos/composable/useRespuestas'
import { useReactivoSeleccionadoStore } from './useReactivoSeleccionado'
import { useBancoNavigation } from '@/app/common/banco-navigation'
import { storeToRefs } from 'pinia'
import { useModalStore } from '@/common/modals/store/modal.store'
import eliminarReactivo from '@/app/common/components/modals/eliminarReactivo.vue'
import { useTiposReactivo } from '@/api/bancos/composable/useTiposReactivo'
import { useReactivoIdioma } from '@/api/bancos/composable/useReactivoIdioma'
import type { Reactivo } from '@/api/bancos/interfaces/reactivo.interface'
import DetalleContenido from './components/DetalleContenido.vue'
import TraduccionEditor from './components/TraduccionEditor.vue'

export interface TabIdioma {
  etiqueta: string
  bandera: string
  esOriginal: boolean
}

const props = withDefaults(
  defineProps<{
    bancoId: string
    esProyecto?: boolean
    reactivoMostrado?: Reactivo
    /** Idiomas del banco/proyecto; si hay más de uno se muestran pestañas. */
    idiomas?: TabIdioma[]
  }>(),
  {
    esProyecto: false,
  },
)

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

// Reactivo a pintar en el contenido (siempre existe en la rama de detalle).
const reactivoDetalle = computed<Reactivo>(
  () => (reactivoMostrado.value ?? selectedReactivo.value) as Reactivo,
)

watch(reactivos, (lista) => {
  const sel = selectedReactivo.value
  if (lista && sel && !lista.some((r) => r.idReactivo === sel.idReactivo)) clear()
})

// Pestañas de idiomas (solo si hay más de uno); es_MX arranca activa por defecto.
const idiomasTabs = computed(() => props.idiomas ?? [])
const tieneVariosIdiomas = computed(() => idiomasTabs.value.length > 1)
const idiomaSeleccionado = ref('')
watch(
  idiomasTabs,
  (tabs) => {
    if (!tabs.some((tab) => tab.etiqueta === idiomaSeleccionado.value)) {
      idiomaSeleccionado.value =
        tabs.find((tab) => tab.esOriginal)?.etiqueta ?? tabs[0]?.etiqueta ?? ''
    }
  },
  { immediate: true },
)

// ¿El idioma activo es el original? (sin pestañas o sin selección → original)
const esIdiomaOriginal = computed(
  () =>
    idiomasTabs.value.find((tab) => tab.etiqueta === idiomaSeleccionado.value)?.esOriginal ?? true,
)

// Idioma a consultar: solo cuando hay multi-idioma y no es el original.
const idiomaParaConsulta = computed(() =>
  tieneVariosIdiomas.value && !esIdiomaOriginal.value ? idiomaSeleccionado.value : undefined,
)

// Reactivo traducido (null si no hay traducción).
const {
  data: reactivoTraducido,
  isLoading: cargandoTraduccion,
  isError: errorTraduccion,
} = useReactivoIdioma(props.bancoId, () => selectedReactivo.value?.idReactivo, idiomaParaConsulta)

// El id con el que se consultan las respuestas: el del reactivo traducido
// si existe (las respuestas traducidas se crearon bajo él), si no el original.
const idReactivoParaRespuestas = computed(
  () => reactivoTraducido.value?.idReactivo ?? selectedReactivo.value?.idReactivo,
)

const {
  data: respuestas,
  isLoading: cargandoRespuestas,
  isError: errorRespuestas,
} = useRespuestas(
  props.bancoId,
  () => idReactivoParaRespuestas.value,
  () => idiomaParaConsulta.value,
)
const tipoReactivoId = computed(
  () => reactivoMostrado.value?.tipoReactivoId ?? selectedReactivo.value?.tipoReactivoId,
)
const { tipoPorId } = useTiposReactivo()

// Reactivo que se pinta: el traducido si existe, si no el original.
const reactivoContenido = computed<Reactivo>(() => reactivoTraducido.value ?? reactivoDetalle.value)

// Sin traducción: idioma distinto del original y la consulta devolvió null.
const sinTraduccion = computed(
  () =>
    !!idiomaParaConsulta.value &&
    !cargandoTraduccion.value &&
    !errorTraduccion.value &&
    !reactivoTraducido.value,
)

// Estado del editor de traducción; se resetea al cambiar de reactivo o idioma.
const traduciendo = ref(false)
watch(
  () => [selectedReactivo.value?.idReactivo, idiomaSeleccionado.value] as const,
  () => {
    traduciendo.value = false
  },
)

// Traducción existente (para el modo actualizar del editor).
const traduccionActual = computed(() => {
  if (!reactivoTraducido.value) return undefined
  return {
    idReactivo: reactivoTraducido.value.idReactivo,
    descripcion: reactivoTraducido.value.descripcion,
    respuestas: respuestas.value ?? [],
  }
})

// Editar es exclusivo del reactivo original (o de bancos sin multi-idioma).
const mostrarEditar = computed(() => !tieneVariosIdiomas.value || esIdiomaOriginal.value)

// Traducir: solo en pestaña de idioma CON traducción, y no estando ya editando.
const mostrarTraducir = computed(
  () =>
    tieneVariosIdiomas.value &&
    !esIdiomaOriginal.value &&
    !!reactivoTraducido.value &&
    !traduciendo.value,
)

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
        :class="props.esProyecto ? 'max-w-none px-4 sm:px-5 lg:px-6' : 'max-w-4xl'"
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
        <div class="bg-base-100 rounded-box border border-base-300 flex flex-col min-h-60">
          <!-- Card Header -->
          <div class="px-8 pt-8 pb-0">
            <div class="flex justify-between items-start mb-6">
              <div>
                <div
                  class="text-2xl font-bold text-base-content tracking-tight mb-1 [&_p]:inline [&_p]:m-0"
                >
                  Reactivo {{ reactivoMostrado?.posicion ?? selectedReactivo.posicion }}
                </div>
                <div class="flex items-center gap-3 text-xs text-base-content/60">
                  <span class="flex items-center gap-1">
                    <i class="fa-regular fa-code-branch text-[14px]"></i>
                    v{{ reactivoMostrado?.version ?? selectedReactivo.version }}
                  </span>
                  <span class="w-1 h-1 rounded-full bg-base-300"></span>
                  <span>
                    {{
                      tipoPorId(reactivoMostrado?.tipoReactivoId ?? selectedReactivo.tipoReactivoId)
                        ?.nombre ?? 'Unknown'
                    }}
                  </span>
                  <span class="w-1 h-1 rounded-full bg-base-300"></span>
                  <span
                    class="flex items-center gap-1"
                    :class="
                      (reactivoMostrado?.esCompleto ?? selectedReactivo.esCompleto)
                        ? 'text-success'
                        : 'text-error'
                    "
                  >
                    <i
                      :class="
                        (reactivoMostrado?.esCompleto ?? selectedReactivo.esCompleto)
                          ? 'fa-solid fa-circle-check'
                          : 'fa-solid fa-circle-x'
                      "
                    ></i>
                    {{
                      (reactivoMostrado?.esCompleto ?? selectedReactivo.esCompleto)
                        ? 'Completo'
                        : 'Incompleto'
                    }}
                  </span>
                  <slot name="datos-proyecto"></slot>
                </div>
              </div>
              <div class="flex gap-2">
                <button
                  v-if="mostrarEditar"
                  class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-base-300 text-xs font-medium text-base-content hover:bg-base-200 transition-colors cursor-pointer"
                  @click="irAEditar"
                >
                  <i class="fa-regular fa-pen-to-square text-[14px]"></i>
                  Editar
                </button>
                <button
                  v-if="mostrarTraducir"
                  class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-warning text-xs font-medium text-warning hover:bg-warning/10 transition-colors cursor-pointer"
                  @click="traduciendo = true"
                >
                  <i class="fa-regular fa-language text-[14px]"></i>
                  Traducir
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
          </div>

          <!-- Pestañas de idiomas (solo si hay más de uno) -->
          <div v-if="tieneVariosIdiomas" class="tabs tabs-lift px-8 pt-4">
            <button
              v-for="idioma in idiomasTabs"
              :key="idioma.etiqueta"
              type="button"
              class="tab gap-2"
              :class="idiomaSeleccionado === idioma.etiqueta ? 'tab-active' : ''"
              @click="idiomaSeleccionado = idioma.etiqueta"
            >
              <span
                v-if="idiomaSeleccionado === idioma.etiqueta"
                class="status status-warning"
                aria-label="Idioma seleccionado"
              ></span>
              <img
                v-if="idioma.bandera"
                :src="idioma.bandera"
                :alt="idioma.etiqueta"
                class="size-4 rounded-full object-cover"
              />
              {{ idioma.etiqueta }}
            </button>
          </div>

          <!-- Contenido único: descripción + respuestas del idioma activo -->
          <TraduccionEditor
            v-if="traduciendo"
            :banco-id="props.bancoId"
            :reactivo="reactivoDetalle"
            :idioma="idiomaSeleccionado"
            :traduccion-actual="traduccionActual"
            @cancelar="traduciendo = false"
          />
          <div v-else-if="cargandoTraduccion" class="p-8 space-y-4">
            <div class="skeleton h-6 w-48"></div>
            <div class="skeleton h-40 w-full rounded-xl"></div>
            <div class="skeleton h-24 w-full rounded-xl"></div>
          </div>
          <div v-else-if="errorTraduccion" class="p-8 text-center text-sm text-error">
            No se pudo cargar el reactivo en {{ idiomaSeleccionado }}.
          </div>
          <div
            v-else-if="sinTraduccion"
            class="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center min-h-60"
          >
            <p class="text-sm text-base-content/60">
              <i class="fa-regular fa-language me-2"></i>
              Este reactivo no tiene traducción en {{ idiomaSeleccionado }}.
            </p>
            <button type="button" class="btn btn-warning btn-sm gap-2" @click="traduciendo = true">
              <i class="fa-regular fa-language"></i>
              Traducir
            </button>
          </div>
          <DetalleContenido
            v-else
            :banco-id="props.bancoId"
            :reactivo="reactivoContenido"
            :tipo-reactivo-id="tipoReactivoId"
            :respuestas="respuestas ?? []"
            :cargando-respuestas="cargandoRespuestas"
            :error-respuestas="errorRespuestas"
            :reactivos="reactivos ?? []"
            :grupo="selectedReactivo.grupo"
          />
        </div>
        <!-- <div class="h-10"></div> -->
      </div>
    </template>

    <template v-else>
      <div
        class="w-full"
        :class="props.esProyecto ? 'max-w-none px-4 sm:px-5 lg:px-6' : 'max-w-4xl'"
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
          </ul>
        </div>

        <div class="flex items-center justify-center">
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
      </div>
    </template>
  </div>
</template>
