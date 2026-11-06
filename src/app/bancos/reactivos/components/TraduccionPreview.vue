<script setup lang="ts">
import FroalaEditor from '@/components/FroalaEditor.vue'
import { preguntaConfig } from '../forms/froalaConfig'

withDefaults(
  defineProps<{
    original: string
    originalLabel?: string
  }>(),
  {
    originalLabel: 'Original',
  },
)

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

    <div
      class="grid grid-cols-1 divide-y divide-warning/30 md:grid-cols-2 md:divide-x md:divide-y-0"
    >
      <section class="min-w-0 p-4">
        <h4 class="mb-2 text-[11px] font-semibold uppercase tracking-wider text-base-content/50">
          {{ originalLabel }}
        </h4>
        <div
          class="fr-view text-sm leading-relaxed text-base-content [&_p]:m-0"
          v-html="original"
        ></div>
      </section>

      <section class="min-w-0">
        <!-- <h4 class="px-4 pt-4 text-[11px] font-semibold uppercase tracking-wider text-warning">
          Traducción
        </h4> -->
        <FroalaEditor
          v-model="traduccion"
          :config="{ ...preguntaConfig, placeholderText: 'Escribe la traducción aquí...' }"
        />
      </section>
    </div>
  </div>
</template>
