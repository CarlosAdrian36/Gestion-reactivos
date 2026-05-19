<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()

const transitionName = computed(() => {
  const order = (route.meta.order as number) || 0

  if (order === 2) return 'slide-left'
  return 'slide-right'
})
const toggleTheme = () => {
  const html = document.documentElement
  const current = html.getAttribute('data-theme')
  html.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark')
}
</script>

<template>
  <div class="background-wrapper">
    <div class="mesh-base"></div>
    <div class="mesh-glow mesh-glow-primary"></div>
    <div class="mesh-glow mesh-glow-secondary"></div>
  </div>
  <!-- <button class="btn btn-primary fixed top-5 right-5" @click="toggleTheme">Cambiar tema</button> -->
  <label class="swap swap-rotate fixed top-5 right-5 cursor-pointer z-50 btn-circle">
    <!-- this hidden checkbox controls the state -->
    <input type="checkbox" @change="toggleTheme" class="theme-controller" value="dark" />

    <!-- sun icon -->
    <svg
      class="swap-on h-10 w-10 fill-current"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      <path
        d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"
      />
    </svg>
    <!-- <i class="swap-on h-10 w-10 h1 fa-duotone fa-regular fa-sun-bright"></i> -->

    <!-- moon icon -->
    <svg
      class="swap-off h-10 w-10 fill-current"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      <path
        d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"
      />
    </svg>
  </label>
  <div class="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
    <router-view v-slot="{ Component }">
      <transition :name="transitionName" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>
<style>
/*  Cuando vas hacia adelante */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.35s ease;
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(40px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-40px);
}

/* Cuando regresas */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.35s ease;
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-40px);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(40px);
}
</style>

<style scoped>
.background-wrapper {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

/* ========================= */
/* DARK MODE — EXACTO       */
/* ========================= */

.mesh-base {
  position: absolute;
  inset: 0;

  background-color: #020617;

  background-image:
    radial-gradient(at 0% 0%, hsla(220, 100%, 15%, 1) 0, transparent 50%),
    radial-gradient(at 100% 0%, hsla(20, 90%, 35%, 1) 0, transparent 50%),
    radial-gradient(at 100% 100%, hsla(210, 100%, 45%, 1) 0, transparent 50%),
    radial-gradient(at 0% 100%, hsla(230, 100%, 10%, 1) 0, transparent 50%);

  transition: all 0.5s ease;
}

/* ========================= */
/* LIGHT MODE — EXACTO      */
/* ========================= */

[data-theme='light'] .mesh-base {
  background-color: #cbd5e1; /* gris frío, nada blanco puro */

  background-image:
    radial-gradient(at 0% 0%, hsla(220, 100%, 55%, 0.95) 0, transparent 55%),
    radial-gradient(at 100% 0%, hsla(20, 95%, 60%, 0.9) 0, transparent 55%),
    radial-gradient(at 100% 100%, hsla(210, 100%, 60%, 0.85) 0, transparent 55%),
    radial-gradient(at 0% 100%, hsla(230, 90%, 50%, 0.8) 0, transparent 55%);
}

/* ========================= */
/* GLOWS EXACTOS            */
/* ========================= */

.mesh-glow {
  position: absolute;
  border-radius: 9999px;
  pointer-events: none;
}

/* Azul inferior */
.mesh-glow-primary {
  width: 320px;
  height: 320px;
  background: rgba(30, 64, 175, 0.2);
  bottom: -80px;
  left: -80px;
  filter: blur(100px);
}

/* Naranja lateral */
.mesh-glow-secondary {
  width: 260px;
  height: 260px;
  background: rgba(245, 158, 11, 0.1);
  top: 25%;
  right: -80px;
  filter: blur(80px);
}
</style>
