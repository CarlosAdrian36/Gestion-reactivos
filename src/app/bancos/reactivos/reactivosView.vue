<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useReactivosMock } from '@/api/bancos/composable/useReactivosMock'
import { useReactivosStore } from './reactivosStore'

const route = useRoute()
const bancoId = String(route.params.id)
const { isLoading } = useReactivosMock()
const { selectedReactivo } = useReactivosStore()

const idiomas: Record<number, string> = {
  1: 'Original (EN)',
  2: 'v1: Es-MX',
  3: 'v2: Fr-CA',
}

const tipoReactivo: Record<number, string> = {
  1: 'Multiple Choice',
  2: 'True/False',
  3: 'Open Answer',
  4: 'Matching',
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
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
            <li class="text-base-content/60">#{{ selectedReactivo.IDReactivo }}</li>
          </ul>
        </div>

        <!-- Detail Card -->
        <div
          class="bg-base-100 rounded-2xl shadow-soft border border-base-300 flex flex-col min-h-150"
        >
          <!-- Card Header -->
          <div class="px-8 pt-8 pb-0">
            <div class="flex justify-between items-start mb-6">
              <div>
                <h1 class="text-2xl font-bold text-base-content tracking-tight mb-1">
                  #{{ selectedReactivo.IDReactivo }}:
                  {{ selectedReactivo.Descripcion.slice(0, 50) }}...
                </h1>
                <div class="flex items-center gap-3 text-xs text-base-content/60">
                  <span class="flex items-center gap-1">
                    <i class="fa-regular fa-code-branch text-[14px]"></i>
                    v{{ selectedReactivo.Version }}
                  </span>
                  <span class="w-1 h-1 rounded-full bg-base-300"></span>
                  <span>{{ tipoReactivo[selectedReactivo.TipoReactivoId] || 'Unknown' }}</span>
                </div>
              </div>
              <div class="flex gap-2">
                <button
                  class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-base-300 text-xs font-medium text-base-content hover:bg-base-200 transition-colors"
                >
                  <i class="fa-regular fa-pen-to-square text-[14px]"></i>
                  Editar
                </button>
                <button
                  class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-error text-error-content text-xs font-bold hover:bg-primary-dark transition-colors shadow-sm"
                >
                  <i class="fa-regular fa-trash"></i>
                  Eliminar
                </button>
              </div>
            </div>

            <!-- Tabs -->
            <div class="w-full border-b border-base-300">
              <div class="flex gap-6">
                <button
                  :class="
                    idiomas[selectedReactivo.IdiomaId] === 'Original (EN)'
                      ? 'relative px-1 pb-4 text-sm font-bold text-primary'
                      : 'group relative px-1 pb-4 text-sm font-medium text-base-content/60 hover:text-base-content transition-colors'
                  "
                >
                  <span class="flex items-center gap-2">Original (EN)</span>
                  <span
                    v-if="idiomas[selectedReactivo.IdiomaId] === 'Original (EN)'"
                    class="absolute bottom-0 left-0 w-full h-0.5 bg-primary"
                  ></span>
                </button>
                <button
                  :class="
                    idiomas[selectedReactivo.IdiomaId] === 'v1: Es-MX'
                      ? 'relative px-1 pb-4 text-sm font-bold text-primary'
                      : 'group relative px-1 pb-4 text-sm font-medium text-base-content/60 hover:text-base-content transition-colors'
                  "
                >
                  <span class="flex items-center gap-2">
                    v1: Es-MX
                    <span class="w-2 h-2 rounded-full bg-amber-400"></span>
                  </span>
                  <span
                    v-if="idiomas[selectedReactivo.IdiomaId] === 'v1: Es-MX'"
                    class="absolute bottom-0 left-0 w-full h-0.5 bg-primary"
                  ></span>
                </button>
                <button
                  class="ml-auto px-2 pb-4 text-base-content/60 hover:text-primary transition-colors"
                >
                  <i class="fa-regular fa-circle-plus text-[20px]"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Content Area -->
          <div class="p-8 space-y-8">
            <!-- Description / Question Stem -->
            <div class="space-y-3">
              <h3
                class="text-xs font-bold uppercase tracking-wider text-base-content/60 flex items-center gap-2"
              >
                <i class="fa-regular fa-file-lines text-[14px]"></i>
                Description
              </h3>
              <div class="bg-base-200 rounded-xl p-6">
                <p class="text-lg text-base-content leading-relaxed">
                  {{ selectedReactivo.Descripcion }}
                </p>
              </div>
            </div>

            <!-- Details Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Cognitive Level -->
              <div class="space-y-2">
                <h3
                  class="text-xs font-bold uppercase tracking-wider text-base-content/60 flex items-center gap-2"
                >
                  <i class="fa-regular fa-brain text-[14px]"></i>
                  Cognitive Level
                </h3>
                <div class="bg-base-200 rounded-xl p-4">
                  <p class="font-semibold text-base-content">
                    {{ selectedReactivo.NivelCognitivo.Descripcion }}
                  </p>
                  <p class="text-xs text-base-content/60 mt-1">
                    ID: {{ selectedReactivo.NivelCognitivo.NivelCognitivoId }}
                  </p>
                </div>
              </div>

              <!-- Subject -->
              <div class="space-y-2">
                <h3
                  class="text-xs font-bold uppercase tracking-wider text-base-content/60 flex items-center gap-2"
                >
                  <i class="fa-regular fa-book text-[14px]"></i>
                  Subject
                </h3>
                <div class="bg-base-200 rounded-xl p-4">
                  <p class="font-semibold text-base-content">
                    {{ selectedReactivo.SubTema.Descripcion }}
                  </p>
                  <p class="text-xs text-base-content/60 mt-1">
                    ID: {{ selectedReactivo.SubTema.SubTemaId }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Metadata Footer -->
            <div
              class="pt-6 border-t border-base-300 flex items-center justify-between text-xs text-base-content/60"
            >
              <div class="flex gap-6">
                <div class="flex flex-col gap-1">
                  <span class="uppercase tracking-wider font-semibold">Version</span>
                  <span
                    class="px-2 py-0.5 bg-base-300 rounded text-base-content font-mono font-medium"
                  >
                    v{{ selectedReactivo.Version }}
                  </span>
                </div>
                <div class="flex flex-col gap-1">
                  <span class="uppercase tracking-wider font-semibold">Type</span>
                  <span class="px-2 py-0.5 bg-base-300 rounded text-base-content font-medium">
                    {{ tipoReactivo[selectedReactivo.TipoReactivoId] || 'Unknown' }}
                  </span>
                </div>
                <div class="flex flex-col gap-1">
                  <span class="uppercase tracking-wider font-semibold">Language</span>
                  <span class="px-2 py-0.5 bg-base-300 rounded text-base-content font-medium">
                    {{ idiomas[selectedReactivo.IdiomaId] || 'Unknown' }}
                  </span>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <div class="text-right">
                  <p class="text-[10px] uppercase tracking-wider text-base-content/40">Created</p>
                  <p class="text-base-content font-medium">
                    {{ fmtDate(selectedReactivo.FechaCreacion) }}
                  </p>
                </div>
                <div class="text-right">
                  <p class="text-[10px] uppercase tracking-wider text-base-content/40">Modified</p>
                  <p class="text-base-content font-medium">
                    {{ fmtDate(selectedReactivo.FechaModificacion) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="h-10"></div>
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
          <h3 class="font-bold text-lg text-base-content">Select a reactivo</h3>
          <p class="text-sm text-base-content/60 mt-2">
            Choose a reactivo from the sidebar to view its details.
          </p>
        </div>
      </div>
    </template>
  </div>
</template>
