<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from '../common/components/sidebar.vue'
import ReactivosSidebar from '../bancos/reactivos/ReactivosSidebar.vue'
import TopMenu from '../common/components/topMenu.vue'

const route = useRoute()
const sidebarType = computed(() => (route.meta as Record<string, string>).sidebar)
</script>

<template>
  <div class="flex flex-col h-screen">
    <TopMenu />
    <div class="flex flex-1 overflow-hidden">
      <Sidebar v-if="sidebarType !== 'reactivos'" />
      <ReactivosSidebar v-else />

      <main class="flex-1 overflow-y-auto p-6 bg-base-200">
        <RouterView />
      </main>
    </div>
  </div>
</template>
