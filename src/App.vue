<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { Toaster } from 'vue-sonner'

import BaseModal from './common/modals/BaseModal.vue'
import { useAuthStore } from './auth/store/auth.store'
import { AuthStatus } from './auth/interface/auth-status.enum'
import { onMounted, watch } from 'vue'
import Fullscreenloaded from './app/common/components/fullscreenloaded.vue'

const authStore = useAuthStore()

const router = useRouter()
const route = useRoute()
//detectar cambios en el estado de autenticación
authStore.$subscribe(
  (_, state) => {
    console.log('Estado de autenticación cambiado:', state.authStatus)
    if (state.authStatus === AuthStatus.Checking) {
      if (localStorage.getItem('token')) {
        return authStore.checkAuthStatus()
      }
    }
    if (route.path.includes('/auth') && state.authStatus === AuthStatus.Authenticated) {
      return router.replace({ name: 'misBancos' })
    }
  },
  {
    immediate: true,
  },
)
watch(
  () => authStore.authStatus,
  (status) => {
    if (status === AuthStatus.NotAuthenticated) {
      router.replace({ name: 'login' })
    }

    if (status === AuthStatus.Authenticated && route.path.includes('/auth')) {
      router.replace({ name: 'misBancos' })
    }
  },
)
onMounted(() => {
  authStore.checkAuthStatus()
})
</script>

<template>
  <Toaster
    theme="light"
    rich-colors
    position="bottom-center"
    close-button
    close-button-position="top-left"
  />
  <BaseModal />
  <!-- <router-view></router-view> -->
  <Fullscreenloaded v-if="authStore.isChecking" />
  <router-view v-else />
</template>

<style scoped></style>
