<template>Aqui se va a mostrar el template de banco dentro de carpetas {{ props.id }}</template>
<script lang="ts" setup>
// import { useRoute } from 'vue-router'

// const route = useRoute()

// const carpetaId = route.params.id

// console.log(carpetaId)

interface Props {
  id: string
}

const props = defineProps<Props>()

console.log(props.id)
</script>
