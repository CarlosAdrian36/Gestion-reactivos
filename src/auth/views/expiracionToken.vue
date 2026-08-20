<template>
  <div class="w-full max-w-md sm:max-w-lg lg:max-w-xl">
    <div
      class="glass-card bg-white/30 dark:bg-white/10 border border-white/30 dark:border-white/10 shadow-2xl rounded-3xl p-6 sm:p-8 lg:p-10 transition-all duration-300"
    >
      <!-- HEADER -->
      <div class="flex flex-col items-center gap-6 mb-10">
        <div
          class="flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left"
        >
          <div class="h-12 px-3 flex items-center justify-center rounded-lg">
            <img
              src="/src/assets/logos/Logo_de_la_UANL.svg.webp"
              alt="UANL Logo"
              class="h-20 w-auto"
            />
          </div>

          <div class="h-8 w-px bg-white/30 dark:bg-white/20"></div>

          <div class="flex items-center gap-2">
            <img src="/src/assets/logos/nx-logo.png" alt="Nexus Logo" class="h-10 w-auto" />
          </div>
        </div>
      </div>

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
    </div>

    <div class="mt-8 text-center text-white/60 text-xs">
      <p>© 2026 Universidad Autónoma de Nuevo León</p>
      <div class="flex justify-center gap-4 mt-2">
        <a class="hover:text-white" href="#">Aviso de Privacidad</a>
        <span class="text-white/20">•</span>
        <a class="hover:text-white" href="#">v.0.0.1</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.glass-card {
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
}
</style>
