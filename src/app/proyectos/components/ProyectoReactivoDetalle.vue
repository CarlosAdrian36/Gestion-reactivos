<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useReactivos } from '@/api/bancos/composable/useReactivos'
import { useTiposReactivo } from '@/api/bancos/composable/useTiposReactivo'
import { useReactivoSeleccionadoStore } from '@/app/bancos/reactivos/useReactivoSeleccionado'
import { useBancoNavigation } from '@/app/common/banco-navigation'
import { useProyectoDetalle } from '@/api/proyectos/composable/useProyectoDetalle'
import { IDIOMA_ORIGINAL, normalizarEtiquetaIdioma } from '@/app/proyectos/idiomas'
import ReactivoContenido from '@/app/proyectos/components/ReactivoContenido.vue'
import ReactivoTraduccion from '@/app/proyectos/components/ReactivoTraduccion.vue'
import { useModalStore } from '@/common/modals/store/modal.store'
import eliminarReactivo from '@/app/common/components/modals/eliminarReactivo.vue'

const props = defineProps<{
  proyectoId: string
}>()

const { data: proyecto } = useProyectoDetalle(() => props.proyectoId)
const { routeNames } = useBancoNavigation()
const store = useReactivoSeleccionadoStore()
const { selectedReactivo } = storeToRefs(store)
const { clear } = store

const { data: reactivos, isLoading } = useReactivos(props.proyectoId)

// Si el reactivo seleccionado desaparece de la lista (p. ej. se eliminó), limpia la selección.
watch(reactivos, (lista) => {
  const sel = selectedReactivo.value
  if (lista && sel && !lista.some((r) => r.idReactivo === sel.idReactivo)) clear()
})

// Idioma activo: arranca en el original (es_MX) cuando cargan los idiomas.
const idiomaActivo = ref('')
watch(
  () => proyecto.value?.idiomas,
  (idiomas) => {
    if (idiomas && !idiomas.some((i) => i.etiqueta === idiomaActivo.value)) {
      const original = idiomas.find((i) => normalizarEtiquetaIdioma(i.etiqueta) === IDIOMA_ORIGINAL)
      idiomaActivo.value = original?.etiqueta ?? idiomas[0]?.etiqueta ?? ''
    }
  },
  { immediate: true },
)

const tieneVariosIdiomas = computed(() => (proyecto.value?.idiomas?.length ?? 0) > 1)

const esIdiomaOriginal = computed(
  () => normalizarEtiquetaIdioma(idiomaActivo.value) === IDIOMA_ORIGINAL,
)

const { tipoPorId } = useTiposReactivo()

const router = useRouter()
const modal = useModalStore()

// Los botones de Editar/Eliminar solo aplican al reactivo original.
const mostrarAcciones = computed(() => !tieneVariosIdiomas.value || esIdiomaOriginal.value)

function irAEditar() {
  router.push({ name: routeNames.value.edit, params: { id: props.proyectoId } })
}

function abrirEliminar() {
  if (!selectedReactivo.value) return
  modal.openModal(
    eliminarReactivo,
    { bancoId: props.proyectoId, reactivo: selectedReactivo.value },
    [
      { label: 'Cerrar', variant: 'outline' },
      { label: 'Eliminar', variant: 'error', type: 'submit' },
    ],
  )
}
</script>

<template>
  <div class="min-h-full flex justify-center">
    <template v-if="isLoading">
      <div class="w-full max-w-none px-4 sm:px-5 lg:px-6 space-y-4">
        <div class="skeleton h-8 w-96"></div>
        <div class="skeleton h-150 w-full rounded-2xl"></div>
      </div>
    </template>

    <template v-else-if="selectedReactivo">
      <div class="w-full max-w-none px-4 sm:px-5 lg:px-6">
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
                :to="{ name: routeNames.detail, params: { id: props.proyectoId } }"
              >
                Proyecto detalle
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
                  Reactivo {{ selectedReactivo.posicion }}
                </div>
                <div class="flex items-center gap-3 text-xs text-base-content/60">
                  <span class="flex items-center gap-1">
                    <i class="fa-regular fa-code-branch text-[14px]"></i>
                    v{{ selectedReactivo.version }}
                  </span>
                  <span class="w-1 h-1 rounded-full bg-base-300"></span>
                  <span>
                    {{ tipoPorId(selectedReactivo.tipoReactivoId)?.nombre ?? 'Unknown' }}
                  </span>
                  <span class="w-1 h-1 rounded-full bg-base-300"></span>
                  <span
                    class="flex items-center gap-1"
                    :class="selectedReactivo.esCompleto ? 'text-success' : 'text-error'"
                  >
                    <i
                      :class="
                        selectedReactivo.esCompleto
                          ? 'fa-solid fa-circle-check'
                          : 'fa-solid fa-circle-x'
                      "
                    ></i>
                    {{ selectedReactivo.esCompleto ? 'Completo' : 'Incompleto' }}
                  </span>
                  <span
                    v-if="selectedReactivo.estado"
                    class="badge badge-sm"
                    :class="
                      selectedReactivo.estado === 'Aceptado'
                        ? 'badge-success'
                        : selectedReactivo.estado === 'Rechazado'
                          ? 'badge-error'
                          : 'badge-outline'
                    "
                  >
                    {{ selectedReactivo.estado }}
                  </span>
                  <span
                    v-if="selectedReactivo.hallazgo"
                    class="inline-flex items-center gap-1 text-warning"
                    title="Tiene hallazgos por revisar"
                  >
                    <i class="fa-solid fa-triangle-exclamation"></i>
                    Hallazgos
                  </span>
                </div>
              </div>

              <div v-if="mostrarAcciones" class="flex gap-2">
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
          </div>

          <!-- Pestañas de idiomas (solo si hay más de uno) -->
          <div v-if="tieneVariosIdiomas" class="tabs tabs-lift px-8 pt-4">
            <button
              v-for="idioma in proyecto?.idiomas"
              :key="idioma.etiqueta"
              type="button"
              class="tab"
              :class="{ 'tab-active': idioma.etiqueta === idiomaActivo }"
              @click="idiomaActivo = idioma.etiqueta"
            >
              {{ idioma.etiqueta }}
            </button>
          </div>

          <!-- Contenido: original o traducción según el tab activo -->
          <ReactivoContenido
            v-if="!tieneVariosIdiomas || esIdiomaOriginal"
            :proyecto-id="props.proyectoId"
            :reactivo="selectedReactivo"
          />
          <ReactivoTraduccion
            v-else
            :proyecto-id="props.proyectoId"
            :reactivo="selectedReactivo"
            :idioma="idiomaActivo"
          />
        </div>
      </div>
    </template>

    <template v-else>
      <div class="w-full max-w-none px-4 sm:px-5 lg:px-6">
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
                :to="{ name: routeNames.detail, params: { id: props.proyectoId } }"
              >
                Proyecto detalle
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
