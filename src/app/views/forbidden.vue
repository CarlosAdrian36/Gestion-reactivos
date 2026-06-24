<script lang="ts" setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="flex items-center justify-center min-h-[60vh]">
    <div class="text-center max-w-md">
      <div
        class="size-24 rounded-full bg-error/10 text-error flex items-center justify-center mx-auto mb-6"
      >
        <i class="fa-solid fa-lock text-4xl"></i>
      </div>

      <h1 class="text-3xl font-bold mb-2">Acceso Denegado</h1>

      <p class="text-base-content/60 mb-8">
        No tienes permisos para acceder a esta página. Si crees que esto es un error, contacta a tu
        administrador.
      </p>

      <button class="btn btn-primary" @click="router.push({ name: 'misBancos' })">
        <i class="fa-regular fa-house"></i>
        Volver al inicio
      </button>
    </div>
  </div>
</template>
