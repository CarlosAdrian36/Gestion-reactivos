<script setup lang="ts">
import { computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useReactivos } from '@/api/bancos/composable/useReactivos'
import { useRespuestas } from '@/api/bancos/composable/useRespuestas'
import { useTiposReactivo } from '@/api/bancos/composable/useTiposReactivo'
import { useReactivoSeleccionadoStore } from '@/app/bancos/reactivos/useReactivoSeleccionado'
import { useBancoNavigation } from '@/app/common/banco-navigation'
import DetalleOpcionMultiple from '@/app/bancos/reactivos/components/DetalleOpcionMultiple.vue'
import DetalleVerdaderoFalso from '@/app/bancos/reactivos/components/DetalleVerdaderoFalso.vue'
import DetalleRelacional from '@/app/bancos/reactivos/components/DetalleRelacional.vue'

const props = defineProps<{
  proyectoId: string
}>()

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

const {
  data: respuestas,
  isLoading: cargandoRespuestas,
  isError: errorRespuestas,
} = useRespuestas(props.proyectoId, () => selectedReactivo.value?.idReactivo)

const tipoReactivoId = computed(() => selectedReactivo.value?.tipoReactivoId)
const { tipoPorId } = useTiposReactivo()
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
            </div>
          </div>

          <!-- Contenido: enunciado + respuestas según tipo -->
          <div class="p-8 space-y-8">
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
                  v-html="selectedReactivo.descripcion"
                ></div>
              </div>
            </div>

            <DetalleOpcionMultiple
              v-if="tipoReactivoId === 1 || tipoReactivoId === 2"
              :respuestas="respuestas ?? []"
              :cargando="cargandoRespuestas"
              :error="errorRespuestas"
            />
            <DetalleVerdaderoFalso
              v-else-if="tipoReactivoId === 3"
              :respuestas="respuestas ?? []"
              :cargando="cargandoRespuestas"
              :error="errorRespuestas"
            />
            <DetalleRelacional
              v-else-if="tipoReactivoId === 5"
              :banco-id="props.proyectoId"
              :grupo="selectedReactivo.grupo"
              :reactivos="reactivos ?? []"
            />
          </div>
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
