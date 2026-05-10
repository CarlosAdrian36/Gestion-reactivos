<!-- <script lang="ts" setup>
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
      <div class="">
        <span class="ps-4 text-xl font-semibold">Banco Reactivos</span>
        <button class="btn swap swap-rotate" @click="sidebar.toggleSidebar()">
          <i class="fa-sharp-duotone fa-solid fa-arrow-right-from-line" v-if="!sidebar.isOpen"></i>
          <i class="fa-sharp-duotone fa-solid fa-arrow-left-from-line" v-else></i>
        </button>
      </div>
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
</template> -->
<script lang="ts" setup>
import { useSidebarStore } from '../store/ui/sidebarStore'

const sidebar = useSidebarStore()
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
          class="menu menu-sm dropdown-content bg-base-100 rounded-2xl z-50 mt-3 w-60 p-2 shadow-xl border border-base-300 [&_li>*]:rounded-xl [&_li>*]:transition-all [&_li>*]:duration-200 [&_li>*:hover]:bg-primary/10 [&_li>*:hover]:text-primary"
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
            <button class="text-error">
              <i class="fa-solid fa-right-from-bracket"></i>
              <span class="text-sm"> Cerrar sesion</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </header>
</template>
