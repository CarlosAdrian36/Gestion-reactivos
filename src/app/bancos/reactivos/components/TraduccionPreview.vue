<script setup lang="ts">
import FroalaEditor from '@/components/FroalaEditor.vue'
import { preguntaConfig } from '../forms/froalaConfig'

defineProps<{
  original: string
}>()

const traduccion = defineModel<string>({ default: '' })
</script>

<template>
  <div class="mt-3 overflow-hidden rounded-xl border border-warning/40">
    <div class="bg-warning/10 px-4 py-3">
      <span
        class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-warning"
      >
        <i class="fa-regular fa-language text-[14px]"></i>
        Traducción
      </span>
    </div>

    <div class="">
      <!-- <div class="min-w-0">
        <p class="mb-1 text-[11px] font-semibold uppercase tracking-wider text-base-content/50">
          Original
        </p>
        <div
          class="fr-view text-sm text-base-content leading-relaxed [&_p]:m-0"
          v-html="original"
        ></div>
      </div> -->
      <FroalaEditor
        v-model="traduccion"
        :config="{ ...preguntaConfig, placeholderText: 'Escribe la traducción aquí...' }"
      />

      <!-- <div class="traduccion-editor min-w-0 rounded-lg border border-warning/30 bg-warning/10 p-3">
      </div> -->
    </div>
  </div>
</template>

<style scoped>
.traduccion-editor :deep(.fr-box),
.traduccion-editor :deep(.fr-wrapper),
.traduccion-editor :deep(.fr-element) {
  width: 100%;
}
</style>
