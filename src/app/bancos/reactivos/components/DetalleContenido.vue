<script setup lang="ts">
import DetalleOpcionMultiple from './DetalleOpcionMultiple.vue'
import DetalleVerdaderoFalso from './DetalleVerdaderoFalso.vue'
import DetalleRelacional from './DetalleRelacional.vue'
import type { Reactivo } from '@/api/bancos/interfaces/reactivo.interface'
import type { Respuesta } from '@/api/bancos/interfaces/respuesta.interface'
import type { Propietario } from '@/api/bancos/interfaces/banco.interface'

const props = defineProps<{
  bancoId: string
  reactivo: Reactivo
  tipoReactivoId?: number
  respuestas: Respuesta[]
  cargandoRespuestas: boolean
  errorRespuestas: boolean
  reactivos: Reactivo[]
  grupo: number
  idioma?: string
}>()

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
  <div class="p-8 space-y-8">
    <!-- Description / Question Stem -->
    <div v-if="props.tipoReactivoId !== 5" class="space-y-3">
      <h3
        class="text-xs font-bold uppercase tracking-wider text-base-content/60 flex items-center gap-2"
      >
        <i class="fa-regular fa-file-lines text-[14px]"></i>
        Descripción / Enunciado
      </h3>
      <div class="bg-base-200 rounded-xl p-6">
        <div
          class="fr-view text-lg text-base-content leading-relaxed [&_p]:m-0"
          v-html="props.reactivo.descripcion"
        ></div>
      </div>
    </div>

    <!-- Respuestas según el tipo de reactivo -->
    <DetalleOpcionMultiple
      v-if="props.tipoReactivoId === 1 || props.tipoReactivoId === 2"
      :respuestas="props.respuestas"
      :cargando="props.cargandoRespuestas"
      :error="props.errorRespuestas"
      :idioma="props.idioma"
    />
    <DetalleVerdaderoFalso
      v-else-if="props.tipoReactivoId === 3"
      :respuestas="props.respuestas"
      :cargando="props.cargandoRespuestas"
      :error="props.errorRespuestas"
      :idioma="props.idioma"
    />
    <DetalleRelacional
      v-else-if="props.tipoReactivoId === 5"
      :banco-id="props.bancoId"
      :grupo="props.grupo"
      :reactivos="props.reactivos"
    />

    <!-- Metadata Footer -->
    <div
      class="pt-6 border-t border-base-300 flex items-center justify-between text-xs text-base-content/60"
    >
      <div class="flex items-center gap-4">
        <div class="text-right">
          <p class="text-[10px] uppercase tracking-wider text-base-content/40">Creado</p>
          <p class="text-base-content font-medium">{{ fmtDate(props.reactivo.fechaCreacion) }}</p>
          <p
            class="max-w-48 truncate text-[10px] text-base-content/60"
            :title="`Creado por ${nombreAutor(props.reactivo.creadoPor)}`"
          >
            Por {{ nombreAutor(props.reactivo.creadoPor) }}
          </p>
        </div>
        <div class="text-right">
          <p class="text-[10px] uppercase tracking-wider text-base-content/40">Modificado</p>
          <p class="text-base-content font-medium">
            {{ fmtDate(props.reactivo.fechaModificacion) }}
          </p>
          <p
            class="max-w-48 truncate text-[10px] text-base-content/60"
            :title="`Modificado por ${nombreAutor(props.reactivo.modificadoPor)}`"
          >
            Por {{ nombreAutor(props.reactivo.modificadoPor) }}
          </p>
        </div>
      </div>
      <div class="flex items-center gap-4">
        <div class="text-right">
          <p class="text-[10px] uppercase tracking-wider text-base-content/40">ID</p>
          <p class="text-base-content font-medium font-mono text-xs">
            {{ props.reactivo.idReactivo }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
