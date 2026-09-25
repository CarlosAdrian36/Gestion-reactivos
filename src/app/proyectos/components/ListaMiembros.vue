<script setup lang="ts">
import type { Propietario } from '@/api/bancos/interfaces/banco.interface'

defineProps<{
  propietario: Propietario
}>()
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center gap-2 mb-6">
      <i class="fa-regular fa-user-group text-primary"></i>
      <h2 class="text-xs font-bold uppercase tracking-widest">Miembros del proyecto</h2>
    </div>

    <div class="flex items-center gap-3">
      <div
        class="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-base font-bold"
      >
        {{ propietario.nombre.charAt(0).toUpperCase()
        }}{{ propietario.apellidoPaterno.charAt(0).toUpperCase() }}
      </div>

      <div class="min-w-0">
        <p class="text-sm font-semibold truncate">
          {{ propietario.nombre }} {{ propietario.apellidoPaterno }} {{ propietario.apellidoMaterno }}
        </p>
        <span class="badge badge-primary badge-sm mt-1">Propietario</span>
      </div>
    </div>

    <div class="mt-6 rounded-xl border border-dashed border-base-300 p-4 text-center">
      <i class="fa-regular fa-user-plus text-xl text-base-content/40"></i>
      <p class="text-sm font-semibold mt-2">Asigna colaboradores al proyecto</p>
      <p class="text-xs text-base-content/60 mt-1">
        Aquí podrás agregar personas y asignarles un rol de trabajo.
      </p>
    </div>

    <button
      type="button"
      class="btn btn-dash btn-primary btn-sm rounded-lg mt-auto"
      disabled
      title="Disponible próximamente"
    >
      <i class="fa-regular fa-user-plus"></i>
      Agregar miembro
    </button>
  </div>
</template>
