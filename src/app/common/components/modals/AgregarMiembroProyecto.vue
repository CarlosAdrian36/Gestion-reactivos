<template>
  <div class="space-y-6">
    <!-- Título -->
    <div>
      <h2 class="text-lg font-bold">Agregar integrante al proyecto</h2>
      <p class="text-sm text-base-content/60 mt-1">
        Busca un usuario del sistema y asígnale una o varias funciones.
      </p>
    </div>

    <!-- Búsqueda -->
    <div class="relative">
      <input
        v-model="busqueda"
        type="text"
        placeholder="Buscar usuario por nombre o cuenta..."
        class="input input-bordered w-full"
      />

      <ul
        v-if="resultados.length"
        class="absolute z-10 w-full bg-base-100 border border-base-300 rounded-box shadow-xl mt-1 max-h-60 overflow-y-auto"
      >
        <li
          v-for="user in resultados"
          :key="user.idCuenta"
          class="px-4 py-3 hover:bg-base-200 cursor-pointer transition-colors flex items-center gap-3"
          @click="seleccionarUsuario(user)"
        >
          <div
            class="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0"
          >
            {{ user.identidad.nombre.charAt(0) }}{{ user.identidad.apellidoPaterno.charAt(0) }}
          </div>
          <div class="min-w-0">
            <p class="font-medium truncate">
              {{ user.identidad.nombre }} {{ user.identidad.apellidoPaterno }}
              {{ user.identidad.apellidoMaterno }}
            </p>
            <p class="text-xs text-base-content/60 truncate">&#64;{{ user.nombreUsuario }}</p>
          </div>
        </li>
      </ul>
    </div>

    <!-- Usuario seleccionado -->
    <div v-if="usuarioSeleccionado" class="card bg-base-100 border border-base-300 shadow-sm">
      <div class="card-body">
        <div class="flex items-start justify-between gap-4">
          <div class="flex gap-4 min-w-0">
            <div
              class="size-14 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-bold shrink-0"
            >
              {{ usuarioSeleccionado.identidad.nombre.charAt(0)
              }}{{ usuarioSeleccionado.identidad.apellidoPaterno.charAt(0) }}
            </div>

            <div class="space-y-1 min-w-0">
              <h4 class="font-bold wrap-break-word">
                {{ usuarioSeleccionado.identidad.nombre }}
                {{ usuarioSeleccionado.identidad.apellidoPaterno }}
                {{ usuarioSeleccionado.identidad.apellidoMaterno }}
              </h4>
              <p class="text-sm text-base-content/60">
                &#64;{{ usuarioSeleccionado.nombreUsuario }}
              </p>
            </div>
          </div>

          <button
            type="button"
            class="btn btn-ghost btn-xs btn-circle text-base-content/60 hover:text-error"
            @click="limpiarUsuarioSeleccionado"
          >
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <!-- Función -->
        <div class="mt-4">
          <p class="mb-3 text-sm font-semibold">
            Seleccione las funciones en el proyecto para el usuario:
          </p>

          <div
            v-if="isLoadingFunciones || isLoadingProyecto"
            class="flex items-center gap-2 text-sm text-base-content/60"
            role="status"
          >
            <span class="loading loading-spinner loading-sm"></span>
            Cargando funciones...
          </div>

          <div
            v-else-if="funcionesDisponibles.length"
            class="flex flex-wrap gap-2"
            role="group"
            aria-label="Funciones en el proyecto"
          >
            <button
              v-for="funcion in funcionesDisponibles"
              :key="funcion.funcionId"
              type="button"
              class="badge badge-lg cursor-pointer transition-colors"
              :class="
                funcionesSeleccionadas.includes(funcion.funcionId)
                  ? 'badge-primary'
                  : 'badge-outline hover:badge-primary'
              "
              :aria-pressed="funcionesSeleccionadas.includes(funcion.funcionId)"
              @click="alternarFuncion(funcion.funcionId)"
            >
              {{ funcion.nombre }}
            </button>
          </div>

          <p v-else class="text-sm text-base-content/50">
            No hay funciones disponibles para este proyecto.
          </p>
        </div>
      </div>
    </div>

    <div v-else class="flex flex-col items-center justify-center py-10 text-base-content/40">
      <i class="fa-regular fa-user-plus text-4xl mb-3"></i>
      <p class="text-sm">Busca y selecciona un usuario para agregarlo al proyecto</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import type { Cuenta } from '@/api/usuarios/interfaces/ususarios.interface'
import { getUsuariosAction } from '@/api/usuarios/actions/get-usuarios.actions'
import { asignarFuncionAction } from '@/api/proyectos/actions/asignar-funcion.action'
import { actualizarFuncionesMiembroAction } from '@/api/proyectos/actions/actualizar-funciones-miembro.action'
import { useFunciones } from '@/api/proyectos/composable/useFunciones'
import { useProyectoDetalle } from '@/api/proyectos/composable/useProyectoDetalle'
import { useModalStore } from '@/common/modals/store/modal.store'

const props = defineProps<{
  idProyecto: string
}>()

const modal = useModalStore()
const queryClient = useQueryClient()
const ROL_DOCENTE_ID = 3

const busqueda = ref('')
const funcionesSeleccionadas = ref<number[]>([])
const usuarioSeleccionado = ref<Cuenta | null>(null)
const cuentaConFuncionInicialAsignada = ref<string | null>(null)

const { data: usuarios } = useQuery({
  queryKey: ['usuarios', 'rol', ROL_DOCENTE_ID],
  queryFn: () => getUsuariosAction(ROL_DOCENTE_ID),
  staleTime: 1000 * 60,
  refetchOnWindowFocus: true,
})

const { data: funcionesData, isLoading: isLoadingFunciones } = useFunciones()
const { data: proyecto, isLoading: isLoadingProyecto } = useProyectoDetalle(() => props.idProyecto)
const funciones = computed(() => funcionesData.value ?? [])
const tieneIdiomasDeTraduccion = computed(() =>
  (proyecto.value?.idiomas ?? []).some(
    (idioma) => idioma.etiqueta.trim().toLowerCase().replace('-', '_') !== 'es_mx',
  ),
)

function esFuncionDeTraduccion(nombre: string): boolean {
  const nombreNormalizado = nombre
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()

  return (
    nombreNormalizado.includes('traductor') ||
    (nombreNormalizado.includes('revisor') && nombreNormalizado.includes('traduccion'))
  )
}

const funcionesDisponibles = computed(() =>
  tieneIdiomasDeTraduccion.value
    ? funciones.value
    : funciones.value.filter((funcion) => !esFuncionDeTraduccion(funcion.nombre)),
)

watch(funcionesDisponibles, (disponibles) => {
  const idsDisponibles = new Set(disponibles.map((funcion) => funcion.funcionId))
  funcionesSeleccionadas.value = funcionesSeleccionadas.value.filter((id) => idsDisponibles.has(id))
})

const resultados = computed(() => {
  const q = busqueda.value.toLowerCase().trim()
  if (!q) return []

  const filtrados = (usuarios.value ?? []).filter(
    (u) =>
      u.nombreUsuario.toLowerCase().includes(q) ||
      u.identidad.nombre.toLowerCase().includes(q) ||
      u.identidad.apellidoPaterno.toLowerCase().includes(q) ||
      u.identidad.apellidoMaterno?.toLowerCase().includes(q),
  )

  filtrados.sort((a, b) => {
    const aNombre = a.nombreUsuario.toLowerCase()
    const bNombre = b.nombreUsuario.toLowerCase()

    const prioridad = (nombre: string): number => {
      if (nombre.startsWith(q)) return 0
      if (nombre.includes(q)) return 1
      return 2
    }

    const aPrioridad = prioridad(aNombre)
    const bPrioridad = prioridad(bNombre)

    if (aPrioridad !== bPrioridad) return aPrioridad - bPrioridad

    return aNombre.localeCompare(bNombre)
  })

  return filtrados.slice(0, 10)
})

function seleccionarUsuario(usuario: Cuenta) {
  if (usuarioSeleccionado.value?.idCuenta !== usuario.idCuenta) {
    cuentaConFuncionInicialAsignada.value = null
  }
  usuarioSeleccionado.value = usuario
  funcionesSeleccionadas.value = []
  busqueda.value = ''
}

function limpiarUsuarioSeleccionado() {
  usuarioSeleccionado.value = null
  funcionesSeleccionadas.value = []
  cuentaConFuncionInicialAsignada.value = null
}

function alternarFuncion(funcionId: number) {
  if (funcionesSeleccionadas.value.includes(funcionId)) {
    funcionesSeleccionadas.value = funcionesSeleccionadas.value.filter((id) => id !== funcionId)
    return
  }

  funcionesSeleccionadas.value.push(funcionId)
}

async function agregar() {
  if (!usuarioSeleccionado.value) {
    toast.error('Selecciona un usuario para agregar')
    return
  }

  if (funcionesSeleccionadas.value.length === 0) {
    toast.error('Selecciona al menos una función para el miembro')
    return
  }

  const idsDisponibles = new Set(funcionesDisponibles.value.map((funcion) => funcion.funcionId))
  const idsValidos = funcionesSeleccionadas.value.filter((id) => idsDisponibles.has(id))

  if (idsValidos.length !== funcionesSeleccionadas.value.length) {
    funcionesSeleccionadas.value = idsValidos
    toast.error('Una o más funciones seleccionadas ya no están disponibles para este proyecto')
    return
  }

  const idCuenta = usuarioSeleccionado.value.idCuenta

  try {
    const integranteYaAgregado = cuentaConFuncionInicialAsignada.value === idCuenta

    if (!integranteYaAgregado) {
      const resultado = await asignarFuncionAction(props.idProyecto, idCuenta, {
        funcionId: idsValidos[0]!,
      })

      if (!resultado.funcionAsignada) {
        throw new Error('No se pudo agregar el integrante con la función inicial')
      }

      cuentaConFuncionInicialAsignada.value = idCuenta
    }

    if (idsValidos.length > 1 || integranteYaAgregado) {
      const resultado = await actualizarFuncionesMiembroAction(props.idProyecto, idCuenta, {
        funcionesId: idsValidos,
      })

      if (!resultado.funcionActualizada) {
        throw new Error('No se pudieron guardar todas las funciones seleccionadas')
      }
    }

    await queryClient.invalidateQueries({
      queryKey: ['integrantes-proyecto', props.idProyecto],
    })

    modal.closeModal()
    const textoFunciones = idsValidos.length === 1 ? 'función' : 'funciones'
    toast.success(`Integrante agregado con ${idsValidos.length} ${textoFunciones}`)
  } catch (error) {
    if (cuentaConFuncionInicialAsignada.value === idCuenta) {
      await queryClient.invalidateQueries({
        queryKey: ['integrantes-proyecto', props.idProyecto],
      })
    }
    toast.error(error instanceof Error ? error.message : 'Ocurrió un error al agregar el miembro')
  }
}

onMounted(() => {
  modal.setSubmitFN(agregar)
})

onUnmounted(() => {
  modal.setSubmitFN(null)
})
</script>
