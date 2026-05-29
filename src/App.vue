<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { Toaster } from 'vue-sonner'

import BaseModal from './common/modals/BaseModal.vue'
import { useAuthStore } from './auth/store/auth.store'
import { AuthStatus } from './auth/interface/auth-status.enum'

const authStore = useAuthStore()

const router = useRouter()
const route = useRoute()
authStore.$subscribe(
  (_, state) => {
    console.log(state.authStatus)
    if (state.authStatus === AuthStatus.Checking) {
      authStore.checkAuthStatus()
      return
    }
    if (route.path.includes('/auth') && state.authStatus === AuthStatus.Authenticated) {
      router.replace({ name: 'misBancos' })
      return
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
