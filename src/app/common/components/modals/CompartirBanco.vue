<template>
  <div class="space-y-6">
    <!-- Título -->
    <div>
      <h2 class="text-lg font-bold">
        Compartir banco:
        <span class="text-primary wrap-break-word">{{ banco?.nombre || 'Sin nombre' }}</span>
      </h2>
    </div>

    <!-- Búsqueda -->
    <div class="relative">
      <!-- <i
        class="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40"
      ></i> -->

      <input
        v-model="busqueda"
        type="text"
        placeholder="Buscar usuario por nombre o cuenta..."
        class="input input-bordered w-full pl-10"
      />

      <ul
        v-if="resultados.length"
        class="absolute z-10 w-full bg-base-100 border border-base-300 rounded-box shadow-xl mt-1 max-h-60 overflow-y-auto"
      >
        <li
          v-for="user in resultados"
          :key="user.nombreUsuario"
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

    <!-- Contenido principal -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-108">
      <!-- Resultado -->
      <div class="lg:col-span-8">
        <h3 class="font-semibold mb-3 flex items-center justify-between">
          <span>{{ usuarioSeleccionado ? 'Usuario seleccionado' : 'Resultado de búsqueda' }}</span>
          <button
            v-if="usuarioSeleccionado"
            class="btn btn-ghost btn-xs btn-circle text-base-content/60 hover:text-error"
            @click="usuarioSeleccionado = null"
          >
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </h3>

        <div v-if="usuarioSeleccionado" class="card bg-base-100 border border-base-300 shadow-sm">
          <div class="card-body">
            <div class="flex gap-4">
              <!-- Avatar -->
              <div
                class="size-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold shrink-0"
              >
                {{ usuarioSeleccionado.identidad.nombre.charAt(0)
                }}{{ usuarioSeleccionado.identidad.apellidoPaterno.charAt(0) }}
              </div>

              <!-- Datos -->
              <div class="space-y-1 min-w-0">
                <h4 class="font-bold text-lg wrap-break-word">
                  {{ usuarioSeleccionado.identidad.nombre }}
                  {{ usuarioSeleccionado.identidad.apellidoPaterno }}
                  {{ usuarioSeleccionado.identidad.apellidoMaterno }}
                </h4>

                <p>
                  <span class="font-medium">Nombre de usuario:</span>
                  {{ usuarioSeleccionado.nombreUsuario }}
                </p>

                <p>
                  <span class="font-medium">Correo:</span>
                  {{ usuarioSeleccionado.correos[0]?.direccion || '—' }}
                </p>

                <p>
                  <span class="font-medium">Rol en plataforma:</span>
                  {{ usuarioSeleccionado.roles[0]?.nombre || '—' }}
                </p>

                <p>
                  <span class="font-medium">Estatus:</span>
                  <span :class="usuarioSeleccionado.vigencia ? 'text-success' : 'text-error'">
                    {{ usuarioSeleccionado.vigencia ? 'Activo' : 'Inactivo' }}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="flex flex-col items-center justify-center py-12 text-base-content/40">
          <i class="fa-regular fa-user text-4xl mb-3"></i>
          <p class="text-sm">Busca y selecciona un usuario para compartir el banco</p>
        </div>

        <!-- Permisos -->
        <div v-if="usuarioSeleccionado" class="mt-6">
          <h3 class="font-semibold mb-4">Selecciona el nivel de permisos:</h3>

          <div class="space-y-5">
            <label class="flex items-start gap-3 cursor-pointer">
              <input
                v-model="permiso"
                type="radio"
                value="lectura"
                class="radio radio-primary mt-1"
              />

              <div>
                <p class="font-medium">
                  Solo lectura
                  <span class="font-normal text-base-content/70">
                    (Puede ver bancos y reactivos)
                  </span>
                </p>

                <p class="text-sm text-base-content/70">
                  El usuario podrá visualizar la información del banco y sus reactivos, pero no
                  podrá realizar modificaciones.
                </p>
              </div>
            </label>

            <label class="flex items-start gap-3 cursor-pointer">
              <input
                v-model="permiso"
                type="radio"
                value="edicion"
                class="radio radio-primary mt-1"
              />

              <div>
                <p class="font-medium">
                  Con permisos de edición
                  <span class="font-normal text-base-content/70">
                    (Puede modificar información de bancos y reactivos)
                  </span>
                </p>

                <p class="text-sm text-base-content/70">
                  El usuario podrá editar la información del banco y sus reactivos.
                </p>
              </div>
            </label>
          </div>
        </div>
      </div>

      <!-- Información banco -->
      <div class="lg:col-span-4">
        <div class="card bg-primary/5 border border-primary/20 shadow-sm h-fit">
          <div class="card-body">
            <div class="flex items-center gap-2 text-primary mb-2">
              <i class="fa-solid fa-circle-info"></i>
              <span class="font-semibold"> Información del banco </span>
            </div>

            <div class="space-y-3">
              <div>
                <p class="text-sm text-base-content/70">Nombre del banco:</p>

                <p class="font-bold wrap-break-word">{{ banco?.nombre || 'Sin nombre' }}</p>
              </div>

              <div>
                <p class="text-sm text-base-content/70">Reactivos:</p>

                <p class="font-medium">{{ banco?.cantidadReactivos ?? 0 }}</p>
              </div>

              <div>
                <p class="text-sm text-base-content/70">Fecha de creación:</p>

                <p class="font-medium">
                  {{
                    banco?.fechaCreacion
                      ? new Date(banco.fechaCreacion).toLocaleDateString('es-ES')
                      : '—'
                  }}
                </p>
              </div>

              <div>
                <p class="text-sm text-base-content/70">Descripción:</p>

                <p>{{ banco?.descripcion || 'Sin descripción' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { Banco } from '@/api/bancos/interfaces/banco.interface'
import type { Cuenta } from '@/api/usuarios/interfaces/ususarios.interface'
import { getUsuariosAction } from '@/api/usuarios/actions/get-usuarios.actions'
import { crearCompartidoAction } from '@/api/bancos/actions/crear-compartido.action'
import { crearPermisoAction } from '@/api/bancos/actions/crear-permiso.action'
import { useModalStore } from '@/common/modals/store/modal.store'
import { toast } from 'vue-sonner'

const props = defineProps<{
  banco?: Banco
}>()

const modal = useModalStore()

const busqueda = ref('')
const permiso = ref('lectura')
const usuarios = ref<Cuenta[]>([])
const usuarioSeleccionado = ref<Cuenta | null>(null)

onMounted(async () => {
  try {
    usuarios.value = await getUsuariosAction()
  } catch (error) {
    console.error('Error al cargar usuarios:', error)
  }
  modal.setSubmitFN(compartir)
})

onUnmounted(() => {
  modal.setSubmitFN(null)
})

const resultados = computed(() => {
  const q = busqueda.value.toLowerCase().trim()
  if (!q) return []

  const filtrados = usuarios.value.filter(
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
  usuarioSeleccionado.value = usuario
  busqueda.value = ''
}

async function compartir() {
  if (!usuarioSeleccionado.value || !props.banco) {
    console.warn('[Compartir] usuario o banco es null', {
      usuario: usuarioSeleccionado.value,
      banco: props.banco,
    })
    return
  }

  console.log('[Compartir] Enviando:', {
    bancoId: props.banco.bancoId,
    nombreUsuario: usuarioSeleccionado.value.nombreUsuario,
    permiso: permiso.value,
  })

  try {
    const { compartido } = await crearCompartidoAction(
      props.banco.bancoId,
      usuarioSeleccionado.value.guid,
    )
    await crearPermisoAction(props.banco.bancoId, compartido.cuentaId, {
      edicion: permiso.value === 'edicion',
    })
    toast.success('Banco compartido correctamente')
    modal.closeModal()
  } catch (error) {
    toast.error(error instanceof Error ? error.message : 'Ocurrió un error al compartir el banco')
  }
}
</script>
