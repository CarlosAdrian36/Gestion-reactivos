<template>
  <header class="flex items-center justify-between p-6 border-b border-gray-100">
    <div class="flex items-center gap-3">
      <div class="text-error">
        <i class="fa-solid fa-right-from-bracket text-3xl"></i>
      </div>
      <h2 class="text-xl font-bold text-slate-800">Cerrar Sesión</h2>
    </div>
  </header>
  <main class="p-4 flex flex-col items-center text-center">
    <div class="w-20 h-20 bg-error/40 rounded-full flex items-center justify-center mb-6">
      <i class="fa-regular fa-right-from-bracket text-5xl text-error"></i>
    </div>
    <h3 class="text-xl font-bold text-slate-900 mb-6 leading-snug max-w-sm">
      ¿Estás seguro que deseas
      <span class="text-error">cerrar sesión</span>?
    </h3>
    <div class="rounded-lg p-4 flex items-start gap-4 text-left w-full mb-8 bg-error/40">
      <div class="mt-1">
        <i class="fa-regular fa-circle-info"></i>
      </div>
      <p class="text-sm leading-relaxed">
        Se cerrará tu sesión actual y serás redirigido a la pantalla de inicio de sesión.
      </p>
    </div>
  </main>
</template>
