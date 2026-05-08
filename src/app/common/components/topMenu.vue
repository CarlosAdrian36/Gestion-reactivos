<script lang="ts" setup>
import { useSidebarStore } from '../store/ui/sidebarStore'

const sidebar = useSidebarStore()
</script>

<template>
  <div class="navbar bg-base-100 border-b border-primary/10">
    <div class="navbar-start">
      <div class="dropdown">
        <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
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
        </div>
      </div>
      <span class="ps-4 text-xl font-semibold">Banco Reactivos</span>
      <button class="btn btn-ghost swap swap-rotate" @click="sidebar.toggleSidebar()">
        <i class="fa-regular fa-arrow-right-from-bracket" v-if="!sidebar.isOpen"></i>
      </button>
      <!-- <i class="fa-duotone fa-regular fa-arrow-left-from-bracket"></i> -->
      <i class="fa-solid fa-arrow-left-from-bracket"></i>
      <i class="fa-solid fa-chevron-left"></i>
    </div>

    <div class="navbar-end">
      <div class="flex-none">
        <label class="toggle text-base-content">
          <input type="checkbox" value="dark" class="theme-controller" />

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
        <div class="dropdown dropdown-end">
          <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
            <div class="w-8 rounded-full">
              <img src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp" />
            </div>
          </div>
          <ul
            tabindex="0"
            class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <a class="justify-between"> Perfil </a>
            </li>
            <li><a>Configuracion</a></li>
            <li><button class="btn-ghost">Actualizar Contraseña</button></li>
            <li><button class="btn btn-sm btn-soft btn-error">Cerrar Sesion</button></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
