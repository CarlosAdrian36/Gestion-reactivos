<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useSidebarStore } from '../common/store/ui/sidebarStore'
import Sidebar from '../common/components/sidebar.vue'
import ReactivosSidebar from '../bancos/reactivos/ReactivosSidebar.vue'
import TopMenu from '../common/components/topMenu.vue'

const route = useRoute()
const sidebar = useSidebarStore()
const sidebarType = computed(() => (route.meta as Record<string, string>).sidebar)

watch(sidebarType, (val) => {
  if (val === 'reactivos') {
    sidebar.isOpen = false
  }
})
</script>

<template>
  <div class="flex flex-col h-screen">
    <TopMenu />
    <div class="flex flex-1 overflow-hidden">
      <Sidebar />
      <ReactivosSidebar v-if="sidebarType === 'reactivos'" />

      <main class="flex-1 overflow-y-auto p-6 bg-base-200">
        <RouterView />
      </main>
    </div>
  </div>
</template>
