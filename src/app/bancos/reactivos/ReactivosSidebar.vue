<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useReactivos } from '@/api/bancos/composable/useReactivos'
import { useReactivoSeleccionadoStore } from './useReactivoSeleccionado'
import type { Reactivo } from '@/api/bancos/interfaces/reactivo.interface'
import { stripHtmlToText } from '@/utils/html'
import { useTiposReactivo } from '@/api/bancos/composable/useTiposReactivo'
import { useInstruccionesGrupos } from '@/api/bancos/composable/useInstruccionesGrupos'
import { storeToRefs } from 'pinia'

interface DisplayIndividual {
  tipo: 'individual'
  reactivo: Reactivo
  posicion: number
}

interface DisplayGrupo {
  tipo: 'grupo'
  grupoId: number
  posicion: number
  instruccion: string
  cantidadReactivos: number
  esCompleto: boolean
  reactivos: Reactivo[]
}

type DisplayItem = DisplayIndividual | DisplayGrupo

const route = useRoute()
const router = useRouter()
const bancoId = route.params.id as string

function irACrear() {
  router.push({
    name: 'crearReactivo',
    params: { id: bancoId },
  })
}

function seleccionarReactivo(r: Reactivo) {
  select(r)
  router.push({
    name: 'reactivosList',
    params: { id: bancoId },
  })
}

function seleccionarGrupo(item: DisplayGrupo) {
  const primerReactivo = item.reactivos[0]
  if (primerReactivo) {
    select(primerReactivo)
    router.push({
      name: 'reactivosList',
      params: { id: bancoId },
    })
  }
}

const abierto = ref(true)
const { data: reactivos, isLoading } = useReactivos(bancoId)
const { data: instrucciones } = useInstruccionesGrupos(bancoId)
const sidebarStore = useReactivoSeleccionadoStore()
const { selectedReactivo } = storeToRefs(sidebarStore)
const { select } = sidebarStore

const itemsParaMostrar = computed<DisplayItem[]>(() => {
  if (!reactivos.value) return []

  const individuales: DisplayItem[] = []
  const porGrupo = new Map<number, Reactivo[]>()

  for (const r of reactivos.value) {
    if (r.tipoReactivoId === 5 && r.grupo > 0) {
      const lista = porGrupo.get(r.grupo) ?? []
      lista.push(r)
      porGrupo.set(r.grupo, lista)
    } else {
      individuales.push({ tipo: 'individual', reactivo: r, posicion: r.posicion })
    }
  }

  const grupos: DisplayItem[] = []
  for (const [grupoId, miembros] of porGrupo) {
    miembros.sort((a, b) => a.posicionGrupo - b.posicionGrupo)
    const instruccion = instrucciones.value?.find((i) => i.grupo === grupoId)
    grupos.push({
      tipo: 'grupo',
      grupoId,
      posicion: miembros[0]!.posicion,
      instruccion: stripHtmlToText(instruccion?.descripcion ?? 'Sin instrucción'),
      cantidadReactivos: miembros.length,
      esCompleto: miembros.every((r) => r.esCompleto),
      reactivos: miembros,
    })
  }

  return [...individuales, ...grupos].sort((a, b) => a.posicion - b.posicion)
})

function preview(r: Reactivo): string {
  return stripHtmlToText(r.descripcion)
}

function isActive(item: DisplayItem): boolean {
  if (!selectedReactivo.value) return false
  if (item.tipo === 'individual') {
    return selectedReactivo.value.idReactivo === item.reactivo.idReactivo
  }
  return (
    selectedReactivo.value.grupo === item.grupoId &&
    selectedReactivo.value.tipoReactivoId === 5
  )
}

const { tipoPorId } = useTiposReactivo()

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
  if (hours < 1) return 'Hace un momento'
  if (hours < 24) return `Hace ${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 30) return `Hace ${days}d`
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
      <template v-if="isLoading">
        <div v-for="i in 4" :key="i" class="p-4 rounded-lg border border-base-300 space-y-2">
          <div class="skeleton h-4 w-24"></div>
          <div class="skeleton h-3 w-full"></div>
          <div class="skeleton h-3 w-2/3"></div>
        </div>
      </template>
      <template v-else-if="itemsParaMostrar.length > 0">
        <template v-for="item in itemsParaMostrar" :key="item.tipo === 'individual' ? item.reactivo.idReactivo : `grupo-${item.grupoId}`">
          <!-- Individual reactivo -->
          <div
            v-if="item.tipo === 'individual'"
            @click="seleccionarReactivo(item.reactivo)"
            class="group relative flex flex-col p-4 rounded-lg cursor-pointer border transition-all"
            :class="
              isActive(item)
                ? 'bg-primary/8 border-primary/30 shadow-sm shadow-primary/10'
                : 'border-transparent hover:bg-white hover:border-base-300 hover:shadow-sm'
            "
          >
            <div
              v-if="isActive(item)"
              class="absolute left-0 top-3 bottom-3 w-1.5 bg-primary rounded-r-full"
            ></div>
            <div class="flex justify-between items-start mb-1">
              <span class="font-bold text-sm text-base-content">#{{ item.reactivo.posicion }}</span>
              <span class="flex items-center gap-1 flex-wrap justify-end">
                <i
                  :class="
                    item.reactivo.esCompleto
                      ? 'fa-solid fa-circle-check text-success'
                      : 'fa-solid fa-circle-x text-error'
                  "
                  :title="item.reactivo.esCompleto ? 'Completo' : 'Incompleto'"
                  class="text-[12px] shrink-0"
                ></i>
                <span
                  v-if="item.reactivo.subTema.descripcion !== 'Sin SubTema'"
                  class="text-xs font-medium text-base-content/60 bg-base-200 px-2 py-0.5 rounded-full"
                >
                  {{ item.reactivo.subTema.descripcion }}
                </span>
              </span>
            </div>
            <p class="text-sm text-base-content/80 mb-2 leading-relaxed line-clamp-2">
              {{ preview(item.reactivo) }}
            </p>

            <div class="flex items-center justify-between mt-auto">
              <div class="flex items-center gap-2">
                <div
                  v-if="item.reactivo.nivelCognitivo.descripcion !== 'Sin Nivel'"
                  class="flex items-center gap-2"
                >
                  <span :class="nivelColor[item.reactivo.nivelCognitivo.descripcion] || 'badge badge-outline'">
                    {{ item.reactivo.nivelCognitivo.descripcion.slice(0, 1) }}
                  </span>
                </div>
                <span class="text-[10px] text-base-content/40">{{
                  fmtDate(item.reactivo.fechaModificacion)
                }}</span>
              </div>
              <span
                class="badge badge-ghost badge-info badge-xs"
                :title="tipoPorId(item.reactivo.tipoReactivoId)?.nombre"
              >
                <i
                  :class="tipoPorId(item.reactivo.tipoReactivoId)?.icono ?? 'fa-regular fa-circle-question'"
                  class="text-[10px]"
                ></i>
              </span>
            </div>
          </div>

          <!-- Grupo relacional -->
          <div
            v-else-if="item.tipo === 'grupo'"
            @click="seleccionarGrupo(item)"
            class="group relative flex flex-col p-4 rounded-lg cursor-pointer border transition-all"
            :class="
              isActive(item)
                ? 'bg-primary/8 border-primary/30 shadow-sm shadow-primary/10'
                : 'border-transparent hover:bg-white hover:border-base-300 hover:shadow-sm'
            "
          >
            <div
              v-if="isActive(item)"
              class="absolute left-0 top-3 bottom-3 w-1.5 bg-primary rounded-r-full"
            ></div>
            <div class="flex justify-between items-start mb-1">
              <span class="font-bold text-sm text-base-content">#{{ item.posicion }}</span>
              <i
                class="fa-regular fa-arrow-right-arrow-left text-primary text-[12px] shrink-0"
                title="Relacional"
              ></i>
            </div>
            <p class="text-sm text-base-content/80 mb-2 leading-relaxed line-clamp-2">
              {{ item.instruccion }}
            </p>

            <div class="flex items-center justify-between mt-auto">
              <div class="flex items-center gap-2">
                <span class="text-xs text-base-content/50 font-medium">
                  {{ item.cantidadReactivos }} reactivos
                </span>
              </div>
              <i
                :class="
                  item.esCompleto
                    ? 'fa-solid fa-circle-check text-success'
                    : 'fa-solid fa-circle-x text-error'
                "
                class="text-[12px]"
              ></i>
            </div>
          </div>
        </template>
      </template>
      <div
        v-else
        class="flex flex-col items-center justify-center h-full text-center text-base-content/60"
      >
        <i class="fa-regular fa-objects-align-left text-4xl mb-2"></i>
        <p class="text-sm font-medium">No hay reactivos</p>
        <p class="text-xs">Agrega el primer reactivo para empezar a trabajar</p>
      </div>
    </div>

    <!-- Fixed bottom button -->
    <div class="p-3 border-t border-base-300" :class="abierto ? 'block' : 'hidden'">
      <button
        @click="irACrear"
        class="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-content text-sm font-bold hover:bg-primary-dark transition-colors cursor-pointer hover:scale-102 overflow-hidden leading-none"
      >
        <i class="fa-regular fa-plus text-[18px]"></i>
        Crear Reactivo
      </button>
    </div>
  </aside>
</template>
