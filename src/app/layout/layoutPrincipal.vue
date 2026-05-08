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

        <!-- <span class="font-sans"> safdasdasdaI </span>
        <span>123123123</span>
        <span class="font-mono">123123</span> -->
      </main>
    </div>
  </div>
</template>
