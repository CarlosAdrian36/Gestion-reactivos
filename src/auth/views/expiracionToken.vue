<script setup lang="ts">
import AuthCard from '@/auth/components/AuthCard.vue'
</script>

<template>
  <AuthCard title="" subtitle="" card-opacity="30">
    <!-- ICONO CENTRAL -->
    <div class="flex justify-center mb-6">
      <div class="w-20 h-20 rounded-full flex items-center justify-center">
        <i class="fa-solid fa-triangle-exclamation text-5xl text-error"></i>
      </div>
    </div>

    <!-- TITULO -->
    <h2 class="text-xl font-bold text-slate-800 text-center mb-4">Enlace expirado o no válido</h2>

    <!-- MENSAJE -->
    <p class="text-sm text-base-content/60 text-center leading-relaxed mb-8 max-w-sm mx-auto">
      El enlace que utilizó ya no es válido o ha expirado. Por favor, contacte a su administrador
      para que le reenvíe el correo de establecer de contraseña.
    </p>

    <!-- BOTON -->
    <router-link
      :to="{ name: 'login' }"
      class="w-full py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/30 transition-all active:scale-[0.98] flex items-center justify-center"
    >
      Volver al inicio de sesión
    </router-link>

    <!-- Footer -->
    <template #footer>
      <div
        class="mt-6 sm:mt-8 pt-4 sm:pt-6 text-center border-t border-gray-200 dark:border-white/10"
      >
        <p class="text-sm text-base-content/50">
          ¿Necesitas ayuda?
          <a class="font-semibold text-primary hover:underline" href="#"
            >Contacta a tu administrador</a
          >
        </p>
      </div>
    </template>
  </AuthCard>
</template>
