<script lang="ts" setup>
import type { Banco } from '@/api/bancos/interfaces/banco.interface'

defineProps<{
  banco: Banco
}>()

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center gap-2 mb-6">
      <i class="fa-regular fa-circle-info text-primary"></i>

      <h2 class="text-xs font-bold uppercase tracking-widest">Información general</h2>
    </div>

    <div class="space-y-3">
      <div class="flex items-center gap-3 rounded-xl bg-base-200/70 p-3">
        <div
          class="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0"
        >
          <i class="fa-solid fa-list-ol"></i>
        </div>
        <div class="min-w-0">
          <p class="text-[10px] uppercase tracking-wider text-base-content/50">Reactivos</p>
          <p class="text-sm font-semibold text-base-content">{{ banco.cantidadReactivos }}</p>
        </div>
      </div>

      <div class="flex items-center gap-3 rounded-xl bg-base-200/70 p-3">
        <div
          class="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0"
        >
          <i class="fa-solid fa-user-tie"></i>
        </div>
        <div class="min-w-0">
          <p class="text-[10px] uppercase tracking-wider text-base-content/50">Propietario</p>
          <p class="text-sm font-semibold text-base-content break-words">
            {{ banco.propietario.nombre }}
            {{ banco.propietario.apellidoPaterno }}
            {{ banco.propietario.apellidoMaterno }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-3 rounded-xl bg-base-200/70 p-3">
        <div
          class="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0"
        >
          <i class="fa-solid fa-calendar-day"></i>
        </div>
        <div class="min-w-0">
          <p class="text-[10px] uppercase tracking-wider text-base-content/50">Creación</p>
          <p class="text-sm font-semibold text-base-content">{{ fmtDate(banco.fechaCreacion) }}</p>
        </div>
      </div>

      <div class="flex items-center gap-3 rounded-xl bg-base-200/70 p-3">
        <div
          class="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0"
        >
          <i class="fa-solid fa-pen-to-square"></i>
        </div>
        <div class="min-w-0">
          <p class="text-[10px] uppercase tracking-wider text-base-content/50">Modificación</p>
          <p class="text-sm font-semibold text-base-content">
            {{ fmtDate(banco.fechaModificacion) }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-3 rounded-xl bg-base-200/70 p-3">
        <div
          class="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0"
        >
          <i class="fa-solid fa-fingerprint"></i>
        </div>
        <div class="min-w-0">
          <p class="text-[10px] uppercase tracking-wider text-base-content/50">ID</p>
          <p class="text-sm font-semibold text-base-content break-words font-mono">
            {{ banco.idBanco }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
