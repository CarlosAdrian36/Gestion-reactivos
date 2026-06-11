<script lang="ts" setup>
import { useModalStore } from '@/common/modals/store/modal.store.ts'
import { useSidebarStore } from '../store/ui/sidebarStore'
import CerrarSesion from './modals/cerrarSesion.vue'
import { useAuthStore } from '@/auth/store/auth.store.ts'
import { computed, onMounted, onUnmounted, ref } from 'vue'

const sidebar = useSidebarStore()
const modal = useModalStore()
const authStore = useAuthStore()
function cerrarSesion() {
  // Lógica para cerrar sesión, como limpiar tokens, redirigir a la página de login, etc.
  modal.openModal(CerrarSesion, {}, [
    { label: 'Cerrar', variant: 'outline' },
    {
      label: 'Salir',
      variant: 'error',
      action: () => {
        modal.closeModal() // Cierra el modal
        authStore.logout() // Llama a la función de logout del store de autenticación
      },
    },
  ]) // Abre el modal de cerrar sesión
}
</script>

<template>
  <header
    class="navbar bg-base-100 border-b border-base-300 px-4 lg:px-6 sticky top-0 z-50 backdrop-blur"
  >
    <!-- LEFT -->
    <div class="navbar-start gap-3">
      <!-- MOBILE MENU -->
      <button class="btn btn-ghost btn-circle lg:hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h8m-8 6h16"
          />
        </svg>
      </button>

      <!-- BRAND -->
      <div class="flex items-center gap-3">
        <div
          class="size-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center"
        >
          <i class="fa-solid fa-building-columns text-lg"></i>
        </div>

        <div class="hidden sm:block">
          <h1 class="text-lg font-bold leading-none">Banco Reactivos</h1>

          <p class="text-xs text-base-content/60">Sistema de gestión</p>
        </div>
      </div>

      <!-- SIDEBAR TOGGLE -->
      <button
        class="btn btn-ghost btn-sm btn-circle swap swap-rotate hover:bg-base-200 transition-all"
        @click="sidebar.toggleSidebar()"
      >
        <i v-if="sidebar.isOpen" class="fa-solid fa-arrow-left-from-line text-sm"></i>

        <i v-else class="fa-solid fa-arrow-right-from-line text-sm"></i>
      </button>
      <span class="countdown font-mono text-4xl">
        <span
          :style="{ '--value': authStore.minutes, '--digits': 2 }"
          aria-live="polite"
          aria-label="minutos"
          >{{ authStore.minutes }}</span
        >
      </span>
      :
      <span class="countdown font-mono text-4xl">
        <span
          :style="{ '--value': authStore.seconds, '--digits': 2 }"
          aria-live="polite"
          aria-label="segundos"
          >{{ authStore.seconds }}</span
        >
      </span>
    </div>

    <!-- RIGHT -->
    <div class="navbar-end gap-2">
      <!-- THEME -->
      <label class="toggle text-base-content">
        <input type="checkbox" value="dark" class="theme-controller" />

        <!-- SUN -->
        <svg aria-label="sun" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <g
            stroke-linejoin="round"
            stroke-linecap="round"
            stroke-width="2"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="12" cy="12" r="4"></circle>
            <path d="M12 2v2"></path>
            <path d="M12 20v2"></path>
            <path d="m4.93 4.93 1.41 1.41"></path>
            <path d="m17.66 17.66 1.41 1.41"></path>
            <path d="M2 12h2"></path>
            <path d="M20 12h2"></path>
            <path d="m6.34 17.66-1.41 1.41"></path>
            <path d="m19.07 4.93-1.41 1.41"></path>
          </g>
        </svg>

        <!-- MOON -->
        <svg aria-label="moon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <g
            stroke-linejoin="round"
            stroke-linecap="round"
            stroke-width="2"
            fill="none"
            stroke="currentColor"
          >
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
          </g>
        </svg>
      </label>

      <!-- AVATAR -->
      <div class="dropdown dropdown-end">
        <button class="btn btn-ghost btn-circle avatar">
          <div class="w-9 rounded-full ring ring-primary/20 ring-offset-2 ring-offset-base-100">
            <img
              src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp"
              alt="profile"
            />
          </div>
        </button>

        <ul
          class="menu menu-sm dropdown-content bg-base-100 rounded-2xl z-50 mt-3 w-60 p-2 shadow-xl border border-base-300"
        >
          <li>
            <a class="text-sm">
              <i class="fa-regular fa-user"></i>
              Perfil
            </a>
          </li>

          <li>
            <a class="text-sm">
              <i class="fa-regular fa-gear"></i>
              Configuración
            </a>
          </li>

          <li>
            <a class="text-sm">
              <i class="fa-solid fa-key"></i>
              Actualizar contraseña
            </a>
          </li>

          <div class="divider my-1"></div>

          <li>
            <button class="text-error" @click="cerrarSesion()">
              <i class="fa-solid fa-right-from-bracket"></i>
              <span class="text-sm"> Cerrar sesion</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </header>
</template>
