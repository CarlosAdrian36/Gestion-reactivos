<template>
  <div class="p-6">
    <div class="flex flex-row items-center mb-4">
      <i class="fa-regular fa-user-gear text-primary pe-2"></i>
      <h2 class="text-xs font-bold uppercase tracking-widest">Banco Compartido</h2>
    </div>

    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="avatar">
            <div class="w-8 h-8 rounded-full">
              <img src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp" />
            </div>
          </div>
          <div>
            <p class="text-xs font-semibold">Admin Usuario</p>
            <p class="text-[10px] text-slate-500">Propietario</p>
          </div>
        </div>
        <button class="hover:text-primary transition-colors text-slate-400">
          <i class="fa-regular fa-gear"></i>
        </button>
      </div>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="avatar">
            <div class="w-8 h-8 rounded-full">
              <img src="https://img.daisyui.com/images/profile/demo/distracted1@192.webp" />
            </div>
          </div>
          <div>
            <p class="text-xs font-semibold">Jorge Rodriguez</p>
            <p class="text-[10px] text-slate-500">Editor</p>
          </div>
        </div>
        <button class="cursor-pointer w-4 h-4 hover:text-error transition-colors text-slate-400">
          <i class="fa-regular fa-user-minus"></i>
        </button>
      </div>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="avatar">
            <div class="w-8 h-8 rounded-full">
              <img src="https://img.daisyui.com/images/profile/demo/distracted2@192.webp" />
            </div>
          </div>
          <div>
            <p class="text-xs font-semibold">Maria Gonzales</p>
            <p class="text-[10px] text-slate-500">Revisor</p>
          </div>
        </div>
        <button class="cursor-pointer w-4 h-4 hover:text-error transition-colors text-slate-400">
          <i class="fa-regular fa-user-minus"></i>
        </button>
      </div>
    </div>
    <button
      class="btn btn-dash btn-block hover:border-primary hover:text-primary hover:bg-base-100 btn-sm rounded-lg border-dashed border-slate-300"
    >
      Compartir
    </button>
  </div>
</template>
