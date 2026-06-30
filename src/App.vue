<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { Toaster } from 'vue-sonner'
import { VueQueryDevtools, VueQueryDevtoolsPanel } from '@tanstack/vue-query-devtools'

import BaseModal from './common/modals/BaseModal.vue'
import { useAuthStore } from './auth/store/auth.store'
import { AuthStatus } from './auth/interface/auth-status.enum'
import { onMounted, watch } from 'vue'
import Fullscreenloaded from './app/common/components/fullscreenloaded.vue'

const authStore = useAuthStore()

const router = useRouter()
const route = useRoute()

watch(
  () => authStore.authStatus,
  (status) => {
    if (status === AuthStatus.NotAuthenticated && route.meta?.requiresAuth) {
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
    position="top-right"
    close-button
    close-button-position="top-left"
    :expand="true"
  />
  <BaseModal />
  <Fullscreenloaded v-if="authStore.isChecking" />
  <router-view v-else />
  <VueQueryDevtools />
</template>

<style scoped></style>
