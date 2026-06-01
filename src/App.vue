<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { Toaster } from 'vue-sonner'

import BaseModal from './common/modals/BaseModal.vue'
import { useAuthStore } from './auth/store/auth.store'
import { AuthStatus } from './auth/interface/auth-status.enum'

const authStore = useAuthStore()

const router = useRouter()
const route = useRoute()
//detectar cambios en el estado de autenticación
authStore.$subscribe(
  (_, state) => {
    if (
      state.authStatus === AuthStatus.NotAuthenticated ||
      state.authStatus === AuthStatus.Checking
    ) {
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
  <router-view></router-view>
</template>

<style scoped></style>
