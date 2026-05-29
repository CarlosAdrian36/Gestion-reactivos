<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { Toaster } from 'vue-sonner'

import BaseModal from './common/modals/BaseModal.vue'
import { useAuthStore } from './auth/store/auth.store'
import { AuthStatus } from './auth/interface/auth-status.enum'
import vueDevTools from 'vite-plugin-vue-devtools'
import { isReturnStatement } from 'typescript'

const authStore = useAuthStore()

const router = useRouter()
const route = useRoute()
authStore.$subscribe(
  (_, state) => {
    if (state.authStatus === AuthStatus.Checking && localStorage.getItem('token')) {
      console.log('Aqui entro al subscribe del authStore')
      authStore.checkAuthStatus()
      return
    }

    if (route.path.includes('/auth') && state.authStatus === AuthStatus.Authenticated) {
      router.replace({ name: 'misBancos' })
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
