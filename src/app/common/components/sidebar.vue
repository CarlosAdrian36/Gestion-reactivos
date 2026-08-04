<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useSidebarStore } from '../store/ui/sidebarStore'
import { useAuthStore } from '@/auth/store/auth.store'
import { useModalStore } from '@/common/modals/store/modal.store'
import CerrarSesion from './modals/cerrarSesion.vue'

const router = useRouter()
const sidebar = useSidebarStore()
const authStore = useAuthStore()
const modal = useModalStore()

function cerrarSesion() {
  modal.openModal(CerrarSesion, {}, [
    { label: 'Cerrar', variant: 'outline' },
    {
      label: 'Salir',
      variant: 'error',
      action: () => {
        modal.closeModal()
        authStore.logout()
      },
    },
  ])
}

const initials = computed(() => {
  if (!authStore.user) return ''
  const id = authStore.user.identidad
  return (id.nombre.charAt(0) + id.apellidoPaterno.charAt(0)).toUpperCase()
})

const temaOscuro = ref(localStorage.getItem('theme') === 'night')

watch(temaOscuro, (val) => {
  const tema = val ? 'night' : 'light'
  document.documentElement.setAttribute('data-theme', tema)
  localStorage.setItem('theme', tema)
})
</script>

<template>
  <aside
    class="bg-base-100 border-r border-primary/10 transition-all duration-300 overflow-y-auto fixed lg:static top-16 left-0 h-[calc(100vh-4rem)] z-40"
    :class="sidebar.isOpen ? 'w-64' : 'w-16'"
  >
    <div
      class="flex h-full flex-col transition-all duration-200"
      :class="sidebar.isOpen ? 'p-4 items-stretch' : 'p-2 items-center'"
    >
      <!-- Navigation label -->
      <p
        v-show="sidebar.isOpen"
        class="px-3 text-[11px] font-bold uppercase tracking-widest text-(--color-texto) mb-2 w-full"
      >
        Navegación
      </p>

      <!-- Nav items -->
      <ul class="flex flex-col gap-1 w-full">
        <li>
          <RouterLink v-slot="{ isActive, navigate }" :to="{ name: 'misBancos' }">
            <div class="relative">
              <div
                v-if="isActive"
                class="absolute left-0 top-2 bottom-2 w-1 bg-primary rounded-r-full"
              ></div>
              <a
                @click="navigate"
                :class="[
                  'flex items-center transition-colors rounded-lg font-medium border',
                  sidebar.isOpen
                    ? 'gap-3 px-3 py-2.5 text-sm'
                    : 'gap-0 p-2.5 justify-center text-xl',
                  isActive
                    ? 'bg-primary/5 border-primary/20 text-primary'
                    : 'border-transparent text-(--color-texto) hover:bg-base-200',
                ]"
                :title="!sidebar.isOpen ? 'Bancos' : undefined"
              >
                <i class="fa-regular fa-file-lines text-xl"></i>
                <span v-show="sidebar.isOpen">Bancos</span>
              </a>
            </div>
          </RouterLink>
        </li>
        <li>
          <RouterLink v-slot="{ isActive, navigate }" :to="{ name: 'compartidos' }">
            <div class="relative">
              <div
                v-if="isActive"
                class="absolute left-0 top-2 bottom-2 w-1 bg-primary rounded-r-full"
              ></div>
              <a
                @click="navigate"
                :class="[
                  'flex items-center transition-colors rounded-lg font-medium border',
                  sidebar.isOpen
                    ? 'gap-3 px-3 py-2.5 text-sm'
                    : 'gap-0 p-2.5 justify-center text-xl',
                  isActive
                    ? 'bg-primary/5 border-primary/20 text-primary'
                    : 'border-transparent text-(--color-texto) hover:bg-base-200',
                ]"
                :title="!sidebar.isOpen ? 'Compartidos' : undefined"
              >
                <i class="fa-regular fa-share-nodes text-xl"></i>
                <span v-show="sidebar.isOpen">Compartidos</span>
              </a>
            </div>
          </RouterLink>
        </li>
        <li v-if="authStore.user?.roles?.some((r) => r.nombre === 'Administrador')">
          <RouterLink v-slot="{ isActive, navigate }" :to="{ name: 'usuarios' }">
            <div class="relative">
              <div
                v-if="isActive"
                class="absolute left-0 top-2 bottom-2 w-1 bg-primary rounded-r-full"
              ></div>
              <a
                @click="navigate"
                :class="[
                  'flex items-center transition-colors rounded-lg font-medium border',
                  sidebar.isOpen
                    ? 'gap-3 px-3 py-2.5 text-sm'
                    : 'gap-0 p-2.5 justify-center text-xl',
                  isActive
                    ? 'bg-primary/5 border-primary/20 text-primary'
                    : 'border-transparent text-(--color-texto) hover:bg-base-200',
                ]"
                :title="!sidebar.isOpen ? 'Usuarios' : undefined"
              >
                <i class="fa-regular fa-user text-xl"></i>
                <span v-show="sidebar.isOpen">Usuarios</span>
              </a>
            </div>
          </RouterLink>
        </li>
      </ul>

      <div v-show="sidebar.isOpen" class="border-t border-primary/10 my-4 w-full"></div>

      <!-- Acciones (tema + cerrar sesion) + User card -->
      <div v-if="authStore.user" class="mt-auto px-3 pb-3 w-full space-y-0.5">
        <template v-if="sidebar.isOpen">
          <button
            class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-(--color-texto) hover:bg-base-200"
            @click="temaOscuro = !temaOscuro"
          >
            <i class="fa-solid fa-circle-half-stroke text-xl"></i>
            <span>{{ temaOscuro ? 'Modo claro' : 'Modo oscuro' }}</span>
          </button>
          <button
            @click="cerrarSesion()"
            class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-error hover:bg-error/10"
          >
            <i class="fa-regular fa-right-from-bracket text-xl"></i>
            <span>Cerrar sesión</span>
          </button>
          <div
            class="rounded-box border border-base-300 bg-base-200 dark:bg-base-300/30 p-4 cursor-pointer"
            @click="router.push({ name: 'perfil' })"
          >
            <div class="flex items-center gap-3">
              <div
                class="size-10 shrink-0 rounded-full bg-base-300 flex items-center justify-center border border-base-300"
              >
                <span class="text-xs font-bold text-base-content">{{ initials }}</span>
              </div>
              <div class="min-w-0">
                <p class="text-xs font-bold text-base-content truncate">
                  {{ authStore.user.identidad.nombre }}
                </p>
                <p class="text-[10px] text-base-content/60 truncate">
                  {{ authStore.user.roles?.[0]?.nombre || '@' + authStore.user.nombreUsuario }}
                </p>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="flex flex-col items-center gap-3">
            <button
              class="flex size-9 items-center justify-center rounded-lg text-base-content/60 hover:text-base-content hover:bg-base-200 transition-colors btn"
              :title="temaOscuro ? 'Modo claro' : 'Modo oscuro'"
              @click="temaOscuro = !temaOscuro"
            >
              <!-- <i class="fa-sharp fa-solid fa-circle-half-stroke text-lg"></i> -->
              <i class="fa-solid fa-circle-half-stroke text-lg"></i>
            </button>
            <button
              class="flex size-9 items-center justify-center rounded-lg text-error/60 hover:text-error hover:bg-error/10 transition-colors btn"
              title="Cerrar sesión"
              @click="cerrarSesion()"
            >
              <i class="fa-regular fa-right-from-bracket text-lg"></i>
            </button>
            <div
              class="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-content font-bold text-xs shadow-sm cursor-pointer transition-transform hover:scale-105 overflow-hidden leading-none"
              @click="router.push({ name: 'perfil' })"
            >
              {{ initials }}
            </div>
          </div>
        </template>
      </div>
      <div v-else class="mt-auto px-3 pb-3 w-full">
        <template v-if="sidebar.isOpen">
          <div class="rounded-box border border-base-300 bg-base-200 dark:bg-base-300/30 p-4">
            <div class="flex items-center gap-3">
              <div class="skeleton size-10 shrink-0 rounded-full"></div>
              <div class="flex flex-col gap-2 flex-1">
                <div class="skeleton h-3 w-20"></div>
                <div class="skeleton h-2 w-28"></div>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="flex flex-col items-center gap-3">
            <div class="skeleton size-9 rounded-lg"></div>
            <div class="skeleton size-9 rounded-lg"></div>
            <div class="skeleton size-9 rounded-full"></div>
          </div>
        </template>
      </div>
    </div>
  </aside>
</template>
