import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rolldownOptions: {
      output: {
        minify: {
          compress: {
            dropConsole: true,
            dropDebugger: true,
          },
        },
      },
    },
  },
  // ========== AÑADE ESTA SECCIÓN SERVER ==========
  server: {
    proxy: {
      '/api': {
        target: 'https://148.234.2.210:30704', // URL base de tu backend (con HTTPS y puerto correcto)
        changeOrigin: true, // Cambia el origen para que el servidor no lo rechace
        secure: false, // Permite certificados autofirmados (solo desarrollo)
        // Si el backend espera la ruta exacta '/api/v1/sesiones', no necesitas rewrite
        // Pero si quieres eliminar el prefijo '/api', descomenta la línea de abajo:
        // rewrite: (path) => path.replace(/^\/api/, '')
      },
    },
  },
})
