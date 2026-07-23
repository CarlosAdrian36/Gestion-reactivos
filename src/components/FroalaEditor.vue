<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, shallowRef } from 'vue'
import FroalaEditor from 'froala-editor'
import 'froala-editor/css/froala_editor.pkgd.min.css'
import 'froala-editor/css/froala_style.min.css'

const props = defineProps<{
  modelValue?: string
  config?: Record<string, unknown>
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const editorRef = ref<HTMLDivElement>()
const editor = shallowRef<InstanceType<typeof FroalaEditor> | null>(null)
let ignoreNextChange = false

onMounted(() => {
  if (!editorRef.value) return

  editor.value = new FroalaEditor(editorRef.value, {
    ...props.config,
    events: {
      initialized() {
        if (props.modelValue) {
          editor.value!.html.set(props.modelValue)
          editor.value!.undo.reset()
        }
      },
      contentChanged() {
        if (ignoreNextChange) {
          ignoreNextChange = false
          return
        }
        const html = editor.value!.html.get()
        emit('update:modelValue', html)
      },
    },
  } as Record<string, unknown>)
})

onBeforeUnmount(() => {
  editor.value?.destroy()
  editor.value = null
})

watch(
  () => props.modelValue,
  (val) => {
    if (!editor.value) return
    const current = editor.value.html.get()
    if (val === current) return
    ignoreNextChange = true
    editor.value.html.set(val ?? '')
  },
)
</script>

<template>
  <div ref="editorRef"></div>
</template>
