<script lang="ts" setup>
import { useAuthStore } from '@/auth/store/auth.store'
import { useModalStore } from '@/common/modals/store/modal.store'
import { ref, watch, onMounted } from 'vue'
import cambiarContrasenaModal from '@/app/common/components/modals/cambiarContrasenaModal.vue'

const authStore = useAuthStore()
const modal = useModalStore()

const themes = [
  { value: 'light', label: 'Claro' },
  { value: 'dark', label: 'Oscuro' },
  { value: 'cupcake', label: 'Cupcake' },
  { value: 'emerald', label: 'Emerald' },
  { value: 'corporate', label: 'Corporate' },
  { value: 'synthwave', label: 'Synthwave' },
  { value: 'retro', label: 'Retro' },
  { value: 'cyberpunk', label: 'Cyberpunk' },
  { value: 'valentine', label: 'Valentine' },
  { value: 'halloween', label: 'Halloween' },
  { value: 'garden', label: 'Garden' },
  { value: 'forest', label: 'Forest' },
  { value: 'aqua', label: 'Aqua' },
  { value: 'lofi', label: 'Lofi' },
  { value: 'pastel', label: 'Pastel' },
  { value: 'fantasy', label: 'Fantasy' },
  { value: 'wireframe', label: 'Wireframe' },
  { value: 'black', label: 'Black' },
  { value: 'luxury', label: 'Luxury' },
  { value: 'dracula', label: 'Dracula' },
  { value: 'cmyk', label: 'CMYK' },
  { value: 'autumn', label: 'Autumn' },
  { value: 'business', label: 'Business' },
  { value: 'acid', label: 'Acid' },
  { value: 'lemonade', label: 'Lemonade' },
  { value: 'night', label: 'Night' },
  { value: 'coffee', label: 'Coffee' },
  { value: 'winter', label: 'Winter' },
  { value: 'dim', label: 'Dim' },
  { value: 'nord', label: 'Nord' },
  { value: 'sunset', label: 'Sunset' },
]

const temaActual = ref(
  localStorage.getItem('theme') || document.documentElement.getAttribute('data-theme') || 'light',
)

watch(temaActual, (val) => {
  document.documentElement.setAttribute('data-theme', val)
  localStorage.setItem('theme', val)
})

function abrirCambiarContrasena() {
  modal.openModal(
    cambiarContrasenaModal,
    {},
    [
      { label: 'Cancelar', variant: 'outline' },
      { label: 'Cambiar contraseña', variant: 'primary', type: 'submit' },
    ],
  )
}

onMounted(async () => {
  document.documentElement.setAttribute('data-theme', temaActual.value)
  if (!authStore.user) {
    await authStore.loadUserProfile()
  }
})
</script>

<template>
  <div class="max-w-3xl mx-auto px-4">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
      <div>
        <h1 class="text-2xl font-bold">Mi Perfil</h1>
        <p class="text-sm text-base-content/70">Información de la cuenta</p>
      </div>
    </div>

    <div v-if="!authStore.user" class="flex justify-center py-20">
      <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>

    <template v-else>
      <div class="rounded-box border border-base-300 bg-base-100 shadow-sm overflow-hidden mb-6">
        <div class="p-6">
          <div class="flex items-center gap-4 mb-6">
            <div
              class="size-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold"
            >
              {{ authStore.user.identidad.nombre.charAt(0)
              }}{{ authStore.user.identidad.apellidoPaterno.charAt(0) }}
            </div>
            <div>
              <h2 class="text-xl font-bold">
                {{ authStore.user.identidad.nombre }}
                {{ authStore.user.identidad.apellidoPaterno }}
                {{ authStore.user.identidad.apellidoMaterno }}
              </h2>
              <p class="text-sm text-base-content/60">&#64;{{ authStore.user.nombreUsuario }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="rounded-box border border-base-300 bg-base-100 shadow-sm overflow-hidden mb-6">
        <div class="p-6">
          <h3 class="font-semibold mb-4">Información general</h3>

          <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt class="text-xs text-base-content/60 uppercase tracking-wider">
                Nombre de usuario
              </dt>
              <dd class="mt-1 font-medium">{{ authStore.user.nombreUsuario }}</dd>
            </div>
            <!-- <div>
              <dt class="text-xs text-base-content/60 uppercase tracking-wider">CURP</dt>
              <dd class="mt-1 font-medium">{{ authStore.user.identidad.curp || '—' }}</dd>
            </div> -->
            <!-- <div>
              <dt class="text-xs text-base-content/60 uppercase tracking-wider">Vigencia</dt>
              <dd class="mt-1">
                <span
                  class="badge"
                  :class="authStore.user.vigencia ? 'badge-success' : 'badge-error'"
                >
                  {{ authStore.user.vigencia ? 'Activa' : 'Inactiva' }}
                </span>
              </dd>
            </div> -->
            <div>
              <dt class="text-xs text-base-content/60 uppercase tracking-wider">Área académica</dt>
              <dd class="mt-1">
                <span
                  class="badge"
                  :class="authStore.user.esCuentaAcademica ? 'badge-info' : 'badge-ghost'"
                >
                  {{ authStore.user.esCuentaAcademica ? 'Sí' : 'No' }}
                </span>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div class="rounded-box border border-base-300 bg-base-100 shadow-sm overflow-hidden mb-6">
        <div class="p-6">
          <h3 class="font-semibold mb-4">Correos electrónicos</h3>

          <ul class="space-y-2">
            <li
              v-for="correo in authStore.user.correos"
              :key="correo.correoId"
              class="flex items-center gap-3 p-3 rounded-xl bg-base-200"
            >
              <i class="fa-regular fa-envelope text-base-content/60"></i>
              <span>{{ correo.direccion }}</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="rounded-box border border-base-300 bg-base-100 shadow-sm overflow-hidden mb-6">
        <div class="p-6">
          <h3 class="font-semibold mb-4">Roles</h3>

          <div class="flex flex-wrap gap-2">
            <span
              v-for="rol in authStore.user.roles"
              :key="rol.rolId"
              class="badge badge-primary badge-outline"
            >
              {{ rol.nombre }}
            </span>
          </div>
        </div>
      </div>

      <div class="rounded-box border border-base-300 bg-base-100 shadow-sm overflow-hidden mb-6">
        <div class="p-6">
          <h3 class="font-semibold mb-4">Seguridad</h3>
          <p class="text-sm text-base-content/60 mb-4">
            Actualiza la contraseña de tu cuenta.
          </p>
          <button class="btn btn-primary" @click="abrirCambiarContrasena">
            <i class="fa-regular fa-lock"></i>
            Cambiar contraseña
          </button>
        </div>
      </div>

      <div class="rounded-box border border-base-300 bg-base-100 shadow-sm overflow-hidden mb-6">
        <div class="p-6">
          <h3 class="font-semibold mb-4">Tema</h3>
          <p class="text-sm text-base-content/60 mb-4">
            Selecciona un tema para la interfaz. Los cambios se aplican en tiempo real.
          </p>
          <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            <button
              v-for="t in themes"
              :key="t.value"
              @click="temaActual = t.value"
              class="flex flex-col items-center gap-1.5 p-2.5 rounded-lg border text-xs font-medium transition-all cursor-pointer"
              :class="
                temaActual === t.value
                  ? 'bg-primary/5 border-primary/20 text-primary'
                  : 'border-base-300 text-base-content/70 hover:bg-base-200 hover:border-base-content/20'
              "
            >
              <div
                class="w-full h-1.5 rounded-full"
                :class="{
                  'bg-primary': temaActual === t.value,
                  'bg-base-300': temaActual !== t.value,
                }"
              ></div>
              <span class="leading-tight text-center">{{ t.label }}</span>
            </button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
