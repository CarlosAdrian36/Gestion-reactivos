import './style.css'
import '@/assets/fontawesome/css/all.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { queryClient } from '@/api/queryClient'

import { Toaster } from 'vue-sonner'
import 'vue-sonner/style.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.component('Toaster', Toaster)
app.use(createPinia())
app.use(router)
app.use(VueQueryPlugin, { queryClient })
app.mount('#app')
