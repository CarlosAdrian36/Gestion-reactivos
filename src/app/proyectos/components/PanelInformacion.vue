<script setup lang="ts">
import { ref } from 'vue'
import type { Banco } from '@/api/bancos/interfaces/banco.interface'

const props = defineProps<{
  banco: Banco
}>()

const idCopiado = ref(false)

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

async function copiarId(): Promise<void> {
  try {
    await navigator.clipboard.writeText(props.banco.idBanco)
    idCopiado.value = true
    setTimeout(() => {
      idCopiado.value = false
    }, 2000)
  } catch {
    // El portapapeles no está disponible en este contexto
  }
}
</script>

<template>
  <section class="h-full flex flex-col card bg-base-100 border border-base-300 shadow-sm p-6">
    <!-- Encabezado -->
    <div class="flex items-center justify-between pb-4 border-b border-base-200">
      <div class="flex items-center gap-2.5">
        <div class="p-2 bg-primary/10 text-primary rounded-lg">
          <i class="fa-regular fa-circle-info"></i>
        </div>
        <h2 class="text-xs sm:text-sm font-bold uppercase tracking-wider">Información General</h2>
      </div>
    </div>

    <!-- Metadatos -->
    <div class="mt-4 space-y-3">
      <div class="flex items-center gap-3.5 p-3 rounded-xl bg-base-200/50 border border-base-200">
        <div
          class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary"
        >
          <i class="fa-solid fa-list-ol text-sm"></i>
        </div>
        <div class="min-w-0 flex-1">
          <span
            class="block text-[11px] font-semibold uppercase tracking-wider text-base-content/40"
          >
            Reactivos
          </span>
          <span class="text-base font-bold">{{ banco.cantidadReactivos }}</span>
        </div>
      </div>

      <div class="flex items-center gap-3.5 p-3 rounded-xl bg-base-200/50 border border-base-200">
        <div
          class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary"
        >
          <i class="fa-solid fa-user-tie text-sm"></i>
        </div>
        <div class="min-w-0 flex-1">
          <span
            class="block text-[11px] font-semibold uppercase tracking-wider text-base-content/40"
          >
            Propietario
          </span>
          <p
            class="text-xs sm:text-sm font-semibold truncate"
            :title="`${banco.propietario.nombre} ${banco.propietario.apellidoPaterno} ${banco.propietario.apellidoMaterno}`"
          >
            {{ banco.propietario.nombre }}
            {{ banco.propietario.apellidoPaterno }}
            {{ banco.propietario.apellidoMaterno }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-3.5 p-3 rounded-xl bg-base-200/50 border border-base-200">
        <div
          class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary"
        >
          <i class="fa-solid fa-calendar-day text-sm"></i>
        </div>
        <div class="min-w-0 flex-1">
          <span
            class="block text-[11px] font-semibold uppercase tracking-wider text-base-content/40"
          >
            Creación
          </span>
          <span class="text-xs sm:text-sm font-medium">{{ fmtDate(banco.fechaCreacion) }}</span>
        </div>
      </div>

      <div class="flex items-center gap-3.5 p-3 rounded-xl bg-base-200/50 border border-base-200">
        <div
          class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary"
        >
          <i class="fa-solid fa-pen-to-square text-sm"></i>
        </div>
        <div class="min-w-0 flex-1">
          <span
            class="block text-[11px] font-semibold uppercase tracking-wider text-base-content/40"
          >
            Modificación
          </span>
          <span class="text-xs sm:text-sm font-medium">{{ fmtDate(banco.fechaModificacion) }}</span>
        </div>
      </div>

      <div class="flex items-center gap-3.5 p-3 rounded-xl bg-base-200/50 border border-base-200">
        <div
          class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary"
        >
          <i class="fa-solid fa-fingerprint text-sm"></i>
        </div>
        <div class="min-w-0 flex-1">
          <span
            class="block text-[11px] font-semibold uppercase tracking-wider text-base-content/40"
          >
            ID del Proyecto
          </span>
          <p class="text-xs font-mono font-medium truncate" :title="banco.idBanco">
            {{ banco.idBanco }}
          </p>
        </div>
        <button
          type="button"
          class="shrink-0 p-1.5 text-base-content/40 hover:text-primary hover:bg-primary/10 rounded-lg transition"
          :title="idCopiado ? '¡Copiado!' : 'Copiar ID al portapapeles'"
          @click="copiarId"
        >
          <i v-if="idCopiado" class="fa-solid fa-check text-success"></i>
          <i v-else class="fa-regular fa-copy"></i>
        </button>
      </div>
    </div>
  </section>
</template>
