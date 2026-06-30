<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useSidebarStore } from '../store/ui/sidebarStore'
import { useAuthStore } from '@/auth/store/auth.store'

const sidebar = useSidebarStore()
const authStore = useAuthStore()

const theme = ref(document.documentElement.getAttribute('data-theme') || 'light')

watch(theme, (val) => {
  document.documentElement.setAttribute('data-theme', val)
})
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
        <!-- <li>
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
        </li> -->
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
        <!-- <li>
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
        </li> -->
        <li v-if="authStore.user?.roles?.some((r) => r.nombre === 'Administrador')">
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

      <div class="border-t border-primary/10 my-4"></div>

      <div class="px-3">
        <p class="text-[11px] font-bold uppercase tracking-widest text-(--color-texto) mb-3">
          Tema
        </p>
        <select class="select select-bordered select-sm w-full" v-model="theme">
          <option value="light">Claro</option>
          <option value="dark">Oscuro</option>
          <option value="cupcake">Cupcake</option>
          <option value="emerald">Emerald</option>
          <option value="corporate">Corporate</option>
          <option value="synthwave">Synthwave</option>
          <option value="retro">Retro</option>
          <option value="cyberpunk">Cyberpunk</option>
          <option value="valentine">Valentine</option>
          <option value="halloween">Halloween</option>
          <option value="garden">Garden</option>
          <option value="forest">Forest</option>
          <option value="aqua">Aqua</option>
          <option value="lofi">Lofi</option>
          <option value="pastel">Pastel</option>
          <option value="fantasy">Fantasy</option>
          <option value="wireframe">Wireframe</option>
          <option value="black">Black</option>
          <option value="luxury">Luxury</option>
          <option value="dracula">Dracula</option>
          <option value="cmyk">CMYK</option>
          <option value="autumn">Autumn</option>
          <option value="business">Business</option>
          <option value="acid">Acid</option>
          <option value="lemonade">Lemonade</option>
          <option value="night">Night</option>
          <option value="coffee">Coffee</option>
          <option value="winter">Winter</option>
          <option value="dim">Dim</option>
          <option value="nord">Nord</option>
          <option value="sunset">Sunset</option>
        </select>
      </div>
    </div>
  </aside>
</template>
