<script lang="ts" setup>
import { useQuery } from '@tanstack/vue-query'
import { getProyectosAction } from '@/api/proyectos/actions/get-proyectos.actions'
import type { BancoProyecto } from '@/api/proyectos/interfaces/proyecto.interface'
import router from '@/router'
import DataTable from '@/app/common/components/table/DataTable.vue'
import type { DataTableColumns } from '@/app/common/components/table/features'
import WorkflowStepper from '@/app/common/components/WorkflowStepper.vue'
import NuevoProyecto from '@/app/common/components/modals/nuevoProyecto.vue'
import EditarProyecto from '@/app/common/components/modals/editarProyecto.vue'
import EliminarProyecto from '@/app/common/components/modals/eliminarProyecto.vue'
import { useModalStore } from '@/common/modals/store/modal.store'
import { useAuthStore } from '@/auth/store/auth.store'
import banderaUs from '@/assets/banderas/us.png'
import banderaFr from '@/assets/banderas/fr.png'

const modal = useModalStore()
const authStore = useAuthStore()

function abrirModalProyecto() {
  modal.openModal(NuevoProyecto, {}, [
    { label: 'Cerrar', variant: 'outline' },
    { label: 'Guardar', variant: 'primary', type: 'submit' },
  ])
}
function closeDropdown() {
  ;(document.activeElement as HTMLElement)?.blur()
}
function abrirModalEditarProyecto(proyecto: BancoProyecto) {
  closeDropdown()
  modal.openModal(EditarProyecto, { proyecto }, [
    { label: 'Cancelar', variant: 'outline' },
    { label: 'Guardar', variant: 'primary', type: 'submit' },
  ])
}
function abrirModalEliminarProyecto(proyecto: BancoProyecto) {
  closeDropdown()
  modal.openModal(
    EliminarProyecto,
    { proyecto },
    [
      { label: 'Cancelar', variant: 'outline' },
      { label: 'Eliminar', variant: 'error', type: 'submit' },
    ],
    'max-w-md',
  )
}

const { data: proyectos, isLoading } = useQuery({
  queryKey: ['proyectos'],
  queryFn: getProyectosAction,
  staleTime: 1000 * 60,
  refetchOnMount: true,
  refetchOnWindowFocus: true,
  refetchOnReconnect: true,
})

const columnas: DataTableColumns<BancoProyecto> = [
  {
    id: 'tipo',
    header: 'Tipo',
    meta: {
      thClass: 'w-16 text-center',
      tdClass: 'px-4 py-4 text-center align-middle',
    },
  },
  {
    accessorKey: 'nombre',
    header: 'Nombre',
    meta: {
      thClass: 'min-w-[17rem]',
      tdClass: 'px-4 py-4 align-middle',
    },
  },
  {
    id: 'idiomas',
    accessorFn: (p) => p.idiomas.filter((i) => i.etiqueta !== 'es_MX').length,
    header: 'Idiomas',
    meta: {
      thClass: 'w-36 text-center',
      tdClass: 'px-4 py-4 text-center align-middle',
    },
  },
  {
    id: 'flujo',
    accessorFn: (p) => {
      const faseActual = p.fases.find((f) => f.estado === 'En proceso')
      return faseActual ? `${faseActual.nombre}-${p.estado.nombre}` : p.estado.nombre
    },
    header: 'Flujo de trabajo',
    meta: {
      thClass: 'min-w-[22rem] text-center',
      tdClass: 'px-6 py-4 text-center align-middle',
    },
  },
  {
    id: 'acciones',
    header: 'Acciones',
    meta: {
      thClass: 'w-28 text-center',
      tdClass: 'px-4 py-4 text-center align-middle overflow-visible',
    },
  },
]

const goToItem = (item: BancoProyecto) => {
  router.push({ name: 'proyectoBancoDetalle', params: { id: item.idProyecto } })
}

function getBandera(etiqueta: string): string {
  switch (etiqueta) {
    case 'en_US':
      return banderaUs
    case 'fr_FR':
      return banderaFr
    default:
      return ''
  }
}

function getCodigoIdioma(etiqueta: string): string {
  if (etiqueta === 'en_US') return 'EN'
  if (etiqueta === 'fr_FR') return 'FR'
  return etiqueta.slice(0, 2).toUpperCase()
}

function normalizarTexto(valor: string | null | undefined): string {
  return valor?.trim().toLocaleLowerCase('es-MX') ?? ''
}

function esEstadoCompletado(estado: string): boolean {
  return ['completada', 'completado', 'finalizada', 'finalizado'].includes(normalizarTexto(estado))
}

function getFaseVigente(proyecto: BancoProyecto) {
  const fasesNoFinalizadas = proyecto.fases.filter(
    (fase) =>
      normalizarTexto(fase.nombre) !== 'finalizado' &&
      !esEstadoCompletado(fase.estado),
  )

  return (
    fasesNoFinalizadas.find((fase) => normalizarTexto(fase.estado) === 'en proceso') ??
    fasesNoFinalizadas[0]
  )
}

function getFaseAccionable(proyecto: BancoProyecto) {
  const faseVigente = getFaseVigente(proyecto)
  const funcionFase = normalizarTexto(faseVigente?.funcion)

  if (!faseVigente || !funcionFase) return undefined

  const estaAsignada = proyecto.funciones.some(
    (funcion) => normalizarTexto(funcion.nombre) === funcionFase,
  )

  return estaAsignada ? faseVigente : undefined
}

function tieneTurnoActual(proyecto: BancoProyecto): boolean {
  return getFaseAccionable(proyecto) !== undefined
}

function getClaseFila(proyecto: BancoProyecto): string {
  const clasesBase = 'group cursor-pointer border-b border-slate-100 transition-colors'

  return tieneTurnoActual(proyecto)
    ? `${clasesBase} border-l-4 border-l-primary bg-gradient-to-r from-blue-50/70 via-white to-white hover:from-blue-50 hover:to-white`
    : `${clasesBase} hover:bg-slate-50/80`
}
</script>

<template>
  <div class="max-w-8xl mx-auto p-8">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
      <div>
        <h1 class="text-2xl font-bold">Gestion de Proyectos</h1>
        <p class="text-sm text-base-content/70">
          Administra bancos de reactivos con flujos de trabajo
        </p>
      </div>
      <div class="flex items-center gap-2">
        <button class="btn btn-primary" @click="abrirModalProyecto">
          <i class="fa-regular fa-plus"></i>
          Crear
        </button>
      </div>
    </div>

    <DataTable
      :data="proyectos"
      :columns="columnas"
      :is-loading="isLoading"
      container-class="rounded-2xl border border-slate-200/80 bg-base-100 shadow-sm overflow-visible"
      table-class="table table-fixed w-full min-w-[980px] block overflow-x-auto whitespace-nowrap"
      :row-class="getClaseFila"
      @row-click="goToItem"
    >
      <template #cell-tipo>
        <div
          class="w-10 h-10 rounded-xl flex items-center justify-center mx-auto bg-blue-50 border border-blue-100 text-primary shadow-sm transition-transform group-hover:scale-105"
        >
          <i class="fa-regular fa-file-lines text-lg"></i>
        </div>
      </template>

      <template #cell-nombre="{ row }">
        <div class="min-w-0">
          <div class="flex min-w-0 flex-wrap items-center gap-2">
            <p
              class="min-w-0 truncate font-bold text-[15px] text-base-content transition-colors group-hover:text-primary"
              :title="row.nombre"
            >
              {{ row.nombre }}
            </p>
            <span
              v-if="tieneTurnoActual(row)"
              class="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-primary/30 bg-primary px-2.5 py-0.5 text-[10px] font-bold text-primary-content shadow-sm"
              :title="`Tu turno: ${getFaseAccionable(row)?.nombre ?? ''}`"
            >
              <span class="inline-grid *:[grid-area:1/1]">
                <span class="status status-accent animate-ping"></span>
                <span class="status status-accent"></span>
              </span>
              Tu turno · {{ getFaseAccionable(row)?.nombre }}
            </span>
          </div>
          <p class="text-xs text-base-content/60 truncate mt-1" :title="row.descripcion">
            {{ row.descripcion }}
          </p>
        </div>
      </template>

      <template #cell-idiomas="{ row }">
        <div class="flex justify-center gap-1.5">
          <span
            v-for="idioma in row.idiomas.filter((i) => i.etiqueta !== 'es_MX')"
            :key="idioma.etiqueta"
            class="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200/80 bg-slate-100/80 px-2 py-1 shadow-sm"
            :title="idioma.descripcion"
          >
            <img
              v-if="getBandera(idioma.etiqueta)"
              :src="getBandera(idioma.etiqueta)"
              alt=""
              class="h-3 w-4 rounded-xs object-cover"
            />
            <span class="text-[10px] font-bold uppercase text-base-content">
              {{ getCodigoIdioma(idioma.etiqueta) }}
            </span>
          </span>
          <span
            v-if="row.idiomas.filter((i) => i.etiqueta !== 'es_MX').length === 0"
            class="text-base-content/40 text-sm font-light"
            >-</span
          >
        </div>
      </template>

      <template #cell-flujo="{ row }">
        <WorkflowStepper
          :fases="row.fases"
          :funciones-asignadas="row.funciones.map((funcion) => funcion.nombre)"
          size="table"
        />
      </template>

      <template #cell-acciones="{ row }">
        <div class="flex items-center justify-end gap-1" @click.stop>
          <button
            type="button"
            class="btn btn-ghost btn-sm btn-circle text-base-content/70 hover:text-primary"
            title="Ver proyecto"
            aria-label="Ver proyecto"
            @click.stop="goToItem(row)"
          >
            <i class="fa-regular fa-eye"></i>
          </button>
          <div class="dropdown dropdown-end dropdown-left">
            <div tabindex="0" role="button" class="btn btn-ghost btn-sm btn-circle">
              <i class="fa-regular fa-ellipsis-vertical"></i>
            </div>
            <ul
              tabindex="0"
              class="dropdown-content menu bg-base-100 rounded-2xl w-52 p-2 shadow-xl border border-base-300"
            >
              <li>
                <a @click="goToItem(row)"><i class="fa-regular fa-eye"></i>Ver</a>
              </li>
              <li v-if="authStore.esAdministrador">
                <a @click="abrirModalEditarProyecto(row)">
                  <i class="fa-regular fa-pen"></i>Editar
                </a>
              </li>
              <div v-if="authStore.esAdministrador" class="divider my-1"></div>
              <li v-if="authStore.esAdministrador">
                <a class="text-error" @click="abrirModalEliminarProyecto(row)">
                  <i class="fa-regular fa-trash"></i>Eliminar
                </a>
              </li>
            </ul>
          </div>
        </div>
      </template>

      <template #empty>
        <div class="flex flex-col items-center py-16">
          <div class="w-20 h-20 rounded-full bg-base-200 flex items-center justify-center mb-4">
            <i class="fa-regular fa-file-lines text-4xl text-base-content/40"></i>
          </div>
          <h2 class="text-lg font-bold">No hay proyectos</h2>
          <p class="text-sm text-base-content/60 mt-1">
            Puedes crear un banco de reactivos con flujo de trabajo para comenzar
          </p>
          <button class="btn btn-primary mt-5" @click="abrirModalProyecto">
            <i class="fa-regular fa-plus"></i>
            Crear proyecto
          </button>
        </div>
      </template>
    </DataTable>
  </div>
</template>
