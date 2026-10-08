<script setup lang="ts">
import { computed } from 'vue'
import type { Propietario } from '@/api/bancos/interfaces/banco.interface'

const props = defineProps<{
  propietario: Propietario
}>()

const nombreCompleto = computed(
  () =>
    `${props.propietario.nombre} ${props.propietario.apellidoPaterno} ${props.propietario.apellidoMaterno}`,
)

const iniciales = computed(() =>
  `${props.propietario.nombre.charAt(0)}${props.propietario.apellidoPaterno.charAt(0)}`.toUpperCase(),
)
</script>

<template>
  <section class="h-full flex flex-col card bg-base-100 border border-base-300 shadow-sm p-6">
    <!-- Encabezado -->
    <div class="flex items-center justify-between pb-4 border-b border-base-200">
      <div class="flex items-center gap-2.5">
        <div class="p-2 bg-primary/10 text-primary rounded-lg">
          <i class="fa-regular fa-user-group"></i>
        </div>
        <h2 class="text-xs sm:text-sm font-bold uppercase tracking-wider">Miembros del Proyecto</h2>
      </div>
      <span
        class="inline-flex items-center rounded-full bg-base-200 px-2.5 py-0.5 text-xs font-semibold text-base-content/70"
      >
        1 miembro
      </span>
    </div>

    <div class="py-4 space-y-4">
      <!-- Propietario -->
      <div
        class="flex items-center justify-between p-3 rounded-xl bg-base-200/50 border border-base-200"
      >
        <div class="flex items-center gap-3 min-w-0">
          <div
            class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-content shadow-sm"
          >
            {{ iniciales }}
          </div>
          <div class="leading-tight min-w-0">
            <p class="text-sm font-semibold truncate" :title="nombreCompleto">
              {{ nombreCompleto }}
            </p>
            <span
              class="inline-flex items-center mt-1 rounded-md bg-primary/15 px-2 py-0.5 text-[11px] font-semibold text-primary"
            >
              Propietario
            </span>
          </div>
        </div>
      </div>

      <!-- Asignación de colaboradores -->
      <div class="rounded-xl border border-dashed border-base-300 bg-base-200/30 p-5 text-center">
        <div
          class="mx-auto flex size-10 items-center justify-center rounded-full bg-base-200 text-base-content/40 mb-2"
        >
          <i class="fa-regular fa-user-plus"></i>
        </div>
        <p class="text-xs font-semibold">Asigna colaboradores al proyecto</p>
        <p class="mt-1 text-xs text-base-content/60">
          Aquí podrás agregar personas del equipo y asignarles un rol de trabajo.
        </p>
      </div>
    </div>

    <!-- Acción -->
    <div class="mt-auto pt-4 border-t border-base-200">
      <button
        type="button"
        disabled
        title="Disponible próximamente"
        class="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-base-200 px-4 py-2.5 text-sm font-semibold text-base-content/80 hover:bg-base-300/60 transition-colors disabled:cursor-not-allowed disabled:opacity-70"
      >
        <i class="fa-regular fa-user-plus"></i>
        Agregar miembro
      </button>
    </div>
  </section>
</template>
