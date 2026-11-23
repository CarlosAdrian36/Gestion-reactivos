<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
    cardOpacity?: '70' | '30'
    showCopyright?: boolean
    copyrightYear?: string
    version?: string
  }>(),
  {
    title: 'Banco de Reactivos',
    subtitle: 'Gestor de bancos para reactivos',
    cardOpacity: '70',
    showCopyright: true,
    copyrightYear: '2026',
    version: 'v.0.0.1',
  },
)
</script>

<template>
  <div class="w-full max-w-md sm:max-w-lg lg:max-w-xl">
    <div
      :class="[
        'glass-card border border-white/30 dark:border-white/10 shadow-2xl rounded-3xl p-6 sm:p-8 lg:p-10 transition-all duration-300',
        cardOpacity === '30' ? 'bg-white/30' : 'bg-white/70',
        'dark:bg-white/10',
      ]"
    >
      <!-- HEADER -->
      <div class="flex flex-col items-center gap-6 mb-10">
        <div class="grid grid-cols-[1fr_auto_1fr] items-center w-full">
          <div class="flex justify-start">
            <img src="/src/assets/logos/UANL-Logo-tm.png" class="h-20 w-auto" />
          </div>

          <div class="h-8 w-px bg-white/30 dark:bg-white/20 mx-4 sm:mx-6"></div>

          <div class="flex justify-end">
            <img src="/src/assets/logos/nx-logo.png" alt="Nexus Logo" class="h-10 w-auto" />
          </div>
        </div>

        <div v-if="title" class="text-center">
          <h1 class="text-2xl font-bold text-base-content/70">{{ title }}</h1>
          <p v-if="subtitle" class="text-sm text-base-content/50">{{ subtitle }}</p>
        </div>
      </div>

      <!-- CONTENT -->
      <slot />

      <!-- FOOTER -->
      <slot name="footer" />
    </div>

    <!-- COPYRIGHT -->
    <div v-if="showCopyright" class="mt-8 text-center text-white/60 text-xs">
      <p>© {{ copyrightYear }} Universidad Autónoma de Nuevo León</p>
      <div class="flex justify-center gap-4 mt-2">
        <a class="hover:text-white" href="#">Aviso de Privacidad</a>
        <span class="text-white/20">•</span>
        <a class="hover:text-white" href="#">{{ version }}</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.glass-card {
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
}
</style>
