<script setup>
import { useRoute } from 'vue-router'
import { useSidebarStore } from '../store/ui/sidebarStore'
import { useAuthStore } from '@/auth/store/auth.store'

const sidebar = useSidebarStore()
const authStore = useAuthStore()
</script>

<template>
  <aside
    class="bg-base-100 border-r border-primary/10 transition-all duration-300 overflow-y-auto fixed lg:static top-16 left-0 h-[calc(100vh-4rem)] z-40"
    :class="sidebar.isOpen ? 'w-64' : 'w-0 '"
  >
    <div
      class="flex flex-col gap-1 p-4 transition-opacity duration-200"
      :class="sidebar.isOpen ? 'opacity-100' : 'opacity-0 '"
    >
      <p class="px-3 text-[11px] font-bold uppercase tracking-widest text-(--color-texto) mb-2">
        Navegación
      </p>
      <ul class="flex flex-col gap-1">
        <li>
          <RouterLink v-slot="{ isActive, navigate }" :to="{ name: 'misBancos' }">
            <a
              @click="navigate"
              :class="[
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-content text-primary'
                  : 'text-(--color-texto) hover:bg-base-200',
              ]"
            >
              <i class="fa-regular fa-file-lines text-xl"></i>
              <span>Bancos</span>
            </a>
          </RouterLink>
        </li>
        <li>
          <RouterLink v-slot="{ isActive, navigate }" :to="{ name: 'proyectos' }">
            <a
              @click="navigate"
              :class="[
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-content text-primary'
                  : 'text-(--color-texto) hover:bg-base-200',
              ]"
            >
              <i class="fa-regular fa-briefcase text-xl"></i>
              <span>Proyectos</span>
            </a>
          </RouterLink>
        </li>
        <li>
          <RouterLink v-slot="{ isActive, navigate }" :to="{ name: 'compartidos' }">
            <a
              @click="navigate"
              :class="[
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-content text-primary'
                  : 'text-(--color-texto) hover:bg-base-200',
              ]"
            >
              <i class="fa-regular fa-share-nodes text-xl"></i>
              <span>Compartidos</span>
            </a>
          </RouterLink>
        </li>
        <li>
          <RouterLink v-slot="{ isActive, navigate }" :to="{ name: 'recursos' }">
            <a
              @click="navigate"
              :class="[
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-content text-primary'
                  : 'text-(--color-texto) hover:bg-base-200',
              ]"
            >
              <i class="fa-solid fa-bookmark text-xl"></i>
              <span>Recursos</span>
            </a>
          </RouterLink>
        </li>
        <li
          v-if="authStore.user?.roles?.some(r => r.nombre === 'Administrador')"
        >
          <RouterLink v-slot="{ isActive, navigate }" :to="{ name: 'usuarios' }">
            <a
              @click="navigate"
              :class="[
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-content text-primary'
                  : 'text-(--color-texto) hover:bg-base-200',
              ]"
            >
              <i class="fa-regular fa-user text-xl"></i>
              <span>Usuarios</span>
            </a>
          </RouterLink>
        </li>
      </ul>
    </div>
  </aside>
</template>
