<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from './auth/store/auth.store'
import BaseModal from './common/modals/BaseModal.vue'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

// if(route.path.includes('login') && state.authStatus ===authStore.authStatus.aute  ) {
//   console.log('Already on login page, skipping auth check.')
// } else {
//   console.log('Not on login page, checking auth status...')
//   authStore.checkAuthStatus()
// }

authStore.$subscribe(
  (_, state) => {
    console.log({ state })
    console.log(state.authStatus)

    if (state.authStatus === authStore.authStatus) {
      console.log('Auth status is the same, checking auth status...')
      authStore.checkAuthStatus()
      return
    }
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <BaseModal />
  <router-view></router-view>
</template>

<style scoped></style>
