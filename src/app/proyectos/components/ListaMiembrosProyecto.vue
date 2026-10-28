<script setup lang="ts">
import { computed } from 'vue'
import type { Propietario } from '@/api/bancos/interfaces/banco.interface'
import type { Integrante } from '@/api/proyectos/interfaces/proyecto.interface'
import { useIntegrantes } from '@/api/proyectos/composable/useIntegrantes'
import { useModalStore } from '@/common/modals/store/modal.store'
import AgregarMiembroProyecto from '@/app/common/components/modals/AgregarMiembroProyecto.vue'

const props = defineProps<{
  idProyecto: string
  propietario: Propietario
}>()

const modal = useModalStore()
const { data: integrantes, isLoading } = useIntegrantes(() => props.idProyecto)

const listaIntegrantes = computed(() => integrantes.value ?? [])
const totalMiembros = computed(() => listaIntegrantes.value.length + 1)

const inicialesPropietario = computed(() => {
  const { nombre, apellidoPaterno } = props.propietario
  return `${nombre.charAt(0)}${apellidoPaterno.charAt(0)}`.toUpperCase()
})

const nombrePropietario = computed(() => {
  const { nombre, apellidoPaterno, apellidoMaterno } = props.propietario
  return `${nombre} ${apellidoPaterno} ${apellidoMaterno}`
})

function inicialesIntegrante(integrante: Integrante): string {
  return `${integrante.nombre.charAt(0)}${integrante.apellidoPaterno.charAt(0)}`.toUpperCase()
}

function nombreIntegrante(integrante: Integrante): string {
  return `${integrante.nombre} ${integrante.apellidoPaterno} ${integrante.apellidoMaterno}`
}

function funcionesIntegrante(integrante: Integrante): string {
  return integrante.funciones.map((funcion) => funcion.nombre).join(', ') || 'Sin función'
}

function abrirModal(): void {
  modal.openModal(
    AgregarMiembroProyecto,
    { idProyecto: props.idProyecto },
    [
      { label: 'Cancelar', variant: 'outline' },
      { label: 'Agregar', variant: 'primary', type: 'submit' },
    ],
    'max-w-3xl',
  )
}
</script>

<template>
  <section
    class="card flex h-full min-h-72 flex-col border border-base-300 bg-base-100 md:min-h-0 p-5 sm:p-6 short:p-3"
  >
    <!-- Encabezado -->
    <div class="flex items-center justify-between pb-2 border-b border-base-200">
      <div class="flex items-center gap-2.5">
        <div class="p-2 bg-primary/10 text-primary rounded-lg">
          <i class="fa-regular fa-user-group"></i>
        </div>
        <h2 class="text-xs sm:text-sm font-bold uppercase tracking-wider">Integrantes</h2>
      </div>
      <span
        class="inline-flex items-center rounded-full bg-base-200 px-2.5 py-0.5 text-xs font-semibold text-base-content/70"
      >
        {{ totalMiembros }} {{ totalMiembros === 1 ? 'integrante' : 'integrantes' }}
      </span>
    </div>

    <!-- Contenido -->
    <div class="min-h-0 flex-1 overflow-y-auto py-4 space-y-3">
      <!-- Propietario -->
      <div class="flex items-center gap-3 rounded-2xl border border-base-200 bg-base-200/50 p-3">
        <div
          class="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-content"
        >
          {{ inicialesPropietario }}
        </div>
        <div class="min-w-0">
          <p class="truncate text-sm font-semibold" :title="nombrePropietario">
            {{ nombrePropietario }}
          </p>
          <span
            class="inline-flex items-center mt-0.5 rounded-md bg-primary/15 px-2 py-0.5 text-[11px] font-semibold text-primary"
          >
            Propietario
          </span>
        </div>
      </div>

      <!-- Integrantes -->
      <template v-if="isLoading">
        <div v-for="i in 2" :key="i" class="p-3 rounded-2xl border border-base-200 space-y-2">
          <div class="skeleton h-4 w-32"></div>
          <div class="skeleton h-3 w-20"></div>
        </div>
      </template>

      <template v-else>
        <div
          v-for="integrante in listaIntegrantes"
          :key="integrante.idCuenta"
          class="flex items-center gap-3 rounded-2xl border border-base-200 bg-base-200/50 p-3"
        >
          <div
            class="flex size-11 shrink-0 items-center justify-center rounded-xl bg-base-300 text-sm font-bold text-base-content/70"
          >
            {{ inicialesIntegrante(integrante) }}
          </div>
          <div class="min-w-0">
            <p class="truncate text-sm font-semibold" :title="nombreIntegrante(integrante)">
              {{ nombreIntegrante(integrante) }}
            </p>
            <span
              class="inline-flex items-center mt-0.5 rounded-md bg-base-200 px-2 py-0.5 text-[11px] font-semibold text-base-content/70"
            >
              {{ funcionesIntegrante(integrante) }}
            </span>
          </div>
        </div>
      </template>
    </div>

    <!-- Acción principal -->
    <div class="mt-4 border-t border-base-200 pt-4">
      <button
        type="button"
        class="btn btn-dash btn-primary w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold"
        @click="abrirModal"
      >
        <i class="fa-regular fa-user-plus"></i>
        Agregar integrante
      </button>
    </div>
  </section>
</template>
