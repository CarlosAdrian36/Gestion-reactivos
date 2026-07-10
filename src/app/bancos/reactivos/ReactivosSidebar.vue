<script setup lang="ts">
import { ref } from 'vue'
import { useReactivosMock } from '@/api/bancos/composable/useReactivosMock'
import { useReactivosStore } from './reactivosStore'

const abierto = ref(true)
const { data: reactivos } = useReactivosMock()
const { selectedReactivo, select } = useReactivosStore()

const nivelColor: Record<string, string> = {
  Remember: 'badge badge-outline text-[10px] font-bold uppercase tracking-wider',
  Understand: 'badge badge-outline badge-info text-[10px] font-bold uppercase tracking-wider',
  Apply: 'badge badge-outline badge-success text-[10px] font-bold uppercase tracking-wider',
  Analyze: 'badge badge-outline badge-warning text-[10px] font-bold uppercase tracking-wider',
  Evaluate: 'badge badge-outline badge-error text-[10px] font-bold uppercase tracking-wider',
  Create: 'badge badge-outline text-[10px] font-bold uppercase tracking-wider',
}

function fmtDate(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const hours = Math.floor(diff / 3600000)
  if (hours < 1) return 'Just now'
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return d.toLocaleDateString()
}
</script>

<template>
  <aside
    class="bg-base-200 border-r border-base-300 transition-all duration-300 shrink-0 h-full flex flex-col relative"
    :class="abierto ? 'w-96' : 'w-0'"
  >
    <!-- Collapse toggle -->
    <button
      class="hover: cursor-pointer absolute -right-5 top-1/2 -translate-y-1/2 z-10 size-9 rounded-full border-2 border-base-300 bg-base-100 flex items-center justify-center transition-all"
      @click="abierto = !abierto"
    >
      <i
        :class="
          abierto ? 'fa-regular fa-chevron-left text-sm' : 'fa-regular fa-chevron-right text-sm'
        "
      ></i>
    </button>

    <!-- Scrollable list -->
    <div class="flex-1 overflow-y-auto p-3 space-y-1" :class="abierto ? 'block' : 'hidden'">
      <template v-if="reactivos && reactivos.length > 0">
        <div
          v-for="r in reactivos"
          :key="r.IDReactivo"
          @click="select(r)"
          class="group relative flex flex-col p-4 rounded-lg cursor-pointer border transition-all"
          :class="
            selectedReactivo?.IDReactivo === r.IDReactivo
              ? 'bg-primary/5 border-primary/20'
              : 'border-transparent hover:bg-white hover:border-base-300 hover:shadow-sm'
          "
        >
          <div
            v-if="selectedReactivo?.IDReactivo === r.IDReactivo"
            class="absolute left-0 top-3 bottom-3 w-1 bg-primary rounded-r-full"
          ></div>
          <div class="flex justify-between items-start mb-1">
            <span class="font-bold text-sm text-base-content">#{{ r.IDReactivo }}</span>
            <span
              class="text-xs font-medium text-base-content/60 bg-base-200 px-2 py-0.5 rounded-full"
            >
              {{ r.SubTema.Descripcion }}
            </span>
          </div>
          <p class="text-sm text-base-content/80 line-clamp-2 mb-2 leading-relaxed">
            {{ r.Descripcion }}
          </p>
          <div class="flex items-center gap-2 mt-auto">
            <span :class="nivelColor[r.NivelCognitivo.Descripcion] || 'badge badge-outline'">
              {{ r.NivelCognitivo.Descripcion }}
            </span>
            <span class="text-[10px] text-base-content/40">{{ fmtDate(r.FechaModificacion) }}</span>
          </div>
        </div>
      </template>
      <div
        v-else
        class="flex flex-col items-center justify-center h-full text-center text-base-content/60"
      >
        <i class="fa-regular fa-file-circle-plus text-4xl mb-2"></i>
        <p class="text-sm font-medium">No hay reactivos</p>
        <p class="text-xs">Agrega el primer reactivo para empezar a trabajar</p>
      </div>
    </div>

    <!-- Fixed bottom button -->
    <div class="p-3 border-t border-base-300" :class="abierto ? 'block' : 'hidden'">
      <button
        class="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-primary-content text-sm font-bold hover:bg-primary-dark transition-colors"
      >
        <i class="fa-regular fa-plus text-[18px]"></i>
        Crear Reactivo
      </button>
    </div>
  </aside>
</template>
