<script setup lang="ts">
import Sidebar from '../common/components/sidebar.vue'
import TopMenu from '../common/components/topMenu.vue'
</script>

<template>
  <div class="flex flex-col h-screen">
    <TopMenu />
    <div class="flex flex-1 overflow-hidden">
      <!-- <Sidebar /> -->
      <Sidebar />

      <main class="flex-1 overflow-y-auto p-6 bg-base-200">
        <RouterView />
      </main>
    </div>
  </div>
</template>
