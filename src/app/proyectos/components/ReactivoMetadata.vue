<script setup lang="ts">
import type { Reactivo } from '@/api/bancos/interfaces/reactivo.interface'
import type { Propietario } from '@/api/bancos/interfaces/banco.interface'

const props = defineProps<{
  reactivo: Reactivo
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
        <p class="text-base-content font-medium">{{ fmtDate(props.reactivo.fechaModificacion) }}</p>
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
        <p class="text-base-content font-medium font-mono text-xs">{{ props.reactivo.idReactivo }}</p>
      </div>
    </div>
  </div>
</template>
