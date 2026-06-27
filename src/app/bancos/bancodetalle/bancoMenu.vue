<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ListaReactivos from '../banconormal/components/lista-reactivos.vue'
import ListaCompartidos from '../banconormal/components/lista-compartidos.vue'
import InfromacionBanco from '../banconormal/components/infromacion-banco.vue'

const route = useRoute()

const bancoId = route.params.id

console.log(bancoId)

onMounted(async () => {})
</script>

<template>
  <!-- {{ bancoStore.selectedBanco?.esProyecto ? 'Es un proyecto' : 'No es un proyecto' }} -->
  <div class="bg-base-200 text-base-content">
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 box-border">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div class="min-w-0 lg:col-span-8 flex flex-col gap-10">
          <header class="space-y-4">
            <h1 class="text-3xl md:text-5xl font-semibold wrap-break-word">
              <!-- {{ bancoStore.selectedBanco?.nombre }} -->
              {{ bancoId }}
            </h1>
            <p class="text-base-content/70 max-w-2xl text-lg wrap-break-word">
              <!-- {{ bancoStore.selectedBanco?.descripcion }} -->
            </p>

            <div class="flex flex-wrap gap-3 pt-4">
              <button class="btn btn-outline btn-sm md:btn-md rounded-full">
                <i class="fa-solid fa-users"></i>
                Miembros
              </button>
              <button class="btn btn-outline btn-sm md:btn-md rounded-full text-primary">
                <i class="fa-regular fa-message-medical"></i>
                Agregar Observación
              </button>
              <button class="btn btn-primary btn-sm md:btn-md rounded-full">
                <i class="fa-solid fa-paper-plane-top"></i>
                Solicitar Revisión
              </button>
            </div>
          </header>

          <section class="card bg-base-100 shadow-sm border border-base-300 overflow-hidden">
            <div
              class="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-base-300"
            >
              <div class="p-6 flex flex-col min-h-0">
                <ListaReactivos />
              </div>
              <div>
                <ListaCompartidos />
              </div>
              <div>
                <InfromacionBanco />
              </div>

              <div class="p-6">
                <div class="flex flex-row items-center mb-4">
                  <i class="fa-regular fa-comment-plus text-primary pe-2"></i>
                  <h2 class="text-xs font-bold uppercase tracking-widest">
                    Añádir observacion general al banco
                  </h2>
                </div>
                <textarea
                  class="textarea textarea-bordered w-full h-24"
                  placeholder="Escribe aquí..."
                ></textarea>
              </div>
            </div>
          </section>

          <section class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="card bg-base-100 border border-base-300 shadow-sm">
              <div class="card-body p-5">
                <div class="flex items-center gap-3">
                  <div class="avatar placeholder">
                    <div class="bg-neutral text-neutral-content rounded-full w-10">
                      <span>JS</span>
                    </div>
                  </div>
                  <div>
                    <h4 class="font-bold text-sm">Juan Salazar</h4>
                    <p class="text-[10px] opacity-60">Hace 15 min</p>
                  </div>
                </div>
                <p class="mt-4 text-sm">Revisar traducción al francés.</p>
                <div class="card-actions justify-end mt-4">
                  <div class="badge badge-outline">Traducción</div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <aside class="lg:col-span-4 mt-12 lg:mt-0">
          <div class="sticky py-1 flex flex-col gap-6">
            <div class="card bg-base-100 shadow-xl p-8 border border-base-300">
              <h3 class="text-2xl font-bold mb-10">Flujo de trabajo</h3>

              <ul class="timeline timeline-vertical">
                <li>
                  <div class="timeline-middle">
                    <div
                      class="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white"
                    >
                      <i class="fa-solid fa-check"></i>
                    </div>
                  </div>
                  <div class="timeline-end font-bold text-primary ps-5">Elaboracion</div>
                  <hr class="py-2 bg-primary" />
                </li>
                <li>
                  <hr class="py-2 bg-primary" />
                  <div class="timeline-middle">
                    <div
                      class="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white"
                    >
                      <i class="fa-solid fa-check"></i>
                    </div>
                  </div>
                  <div class="timeline-end font-bold text-primary ps-5">Revision</div>
                  <hr class="bg-primary" />
                </li>
                <li>
                  <hr class="py-2 bg-primary" />
                  <div class="timeline-middle">
                    <div
                      class="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white"
                    >
                      <i class="fa-solid fa-check"></i>
                    </div>
                  </div>
                  <div class="timeline-end font-bold text-primary ps-5">Traduccion</div>
                  <hr class="py-2 bg-primary" />
                </li>
                <li>
                  <hr class="py-4 bg-primary" />
                  <div class="timeline-middle">
                    <div
                      class="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white"
                    >
                      <i class="fa-solid fa-check"></i>
                    </div>
                  </div>
                  <div class="timeline-end font-bold ps-5">Revision Final</div>
                  <hr class="" />
                </li>
                <li>
                  <hr class="py-4" />
                  <div class="timeline-middle">
                    <div
                      class="w-10 h-10 rounded-full bg-base-300 flex items-center justify-center text-white"
                    >
                      <i class="fa-solid fa-check"></i>
                    </div>
                  </div>
                  <div class="timeline-end text-base-300 font-bold ps-5">Terminado</div>
                </li>
              </ul>
            </div>

            <div class="alert alert-info shadow-sm bg-info/10 border-info/20">
              <span class="material-icons-outlined">info</span>
              <div>
                <h3 class="font-bold text-xs uppercase opacity-70">Fecha límite</h3>
                <p class="text-sm font-bold">20 de Octubre, 2026</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  </div>
</template>
<style scoped>
/* * {
  outline: 1px solid red;
} */
</style>
