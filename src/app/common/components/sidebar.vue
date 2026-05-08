<script setup>
import { useSidebarStore } from '../store/ui/sidebarStore'

const sidebar = useSidebarStore()
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
      <ul class="menu bg-base-200 rounded-box">
        <RouterLink> </RouterLink>
      </ul>
    </div>
  </aside>
</template>
