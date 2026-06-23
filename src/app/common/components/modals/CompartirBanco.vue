<template>
  <div class="space-y-6">
    <!-- Título -->
    <div>
      <h2 class="text-lg font-bold">
        Compartir banco:
        <span class="text-primary">Examen Matemáticas 1</span>
      </h2>
    </div>

    <!-- Búsqueda -->
    <div class="flex gap-3">
      <input
        v-model="busqueda"
        type="text"
        placeholder="Buscar usuario..."
        class="input input-bordered w-full max-w-md"
      />

      <button class="btn btn-primary">Buscar</button>
    </div>

    <!-- Contenido principal -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
      <!-- Resultado -->
      <div class="lg:col-span-8">
        <h3 class="font-semibold mb-3">Resultado de búsqueda</h3>

        <div class="card bg-base-100 border border-base-300 shadow-sm">
          <div class="card-body">
            <div class="flex gap-4">
              <!-- Avatar -->
              <div class="avatar">
                <div class="w-22 h-22 rounded-full">
                  <img src="https://img.daisyui.com/images/profile/demo/distracted1@192.webp" />
                </div>
              </div>

              <!-- Datos -->
              <div class="space-y-1">
                <h4 class="font-bold text-lg">Ana López Martínez</h4>

                <p>
                  <span class="font-medium">Número de cuenta:</span>
                  20221234
                </p>

                <p>
                  <span class="font-medium">Correo:</span>
                  ana.lopez@institucion.edu.mx
                </p>

                <p>
                  <span class="font-medium">Rol en plataforma:</span>
                  Docente
                </p>

                <p>
                  <span class="font-medium">Estatus:</span>
                  <span class="text-success">Activo</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Permisos -->
        <div class="mt-6">
          <h3 class="font-semibold mb-4">Selecciona el nivel de permisos:</h3>

          <div class="space-y-5">
            <label class="flex items-start gap-3 cursor-pointer">
              <input
                v-model="permiso"
                type="radio"
                value="lectura"
                class="radio radio-primary mt-1"
              />

              <div>
                <p class="font-medium">
                  Solo lectura
                  <span class="font-normal text-base-content/70">
                    (Puede ver bancos y reactivos)
                  </span>
                </p>

                <p class="text-sm text-base-content/70">
                  El usuario podrá visualizar la información del banco y sus reactivos, pero no
                  podrá realizar modificaciones.
                </p>
              </div>
            </label>

            <label class="flex items-start gap-3 cursor-pointer">
              <input
                v-model="permiso"
                type="radio"
                value="edicion"
                class="radio radio-primary mt-1"
              />

              <div>
                <p class="font-medium">
                  Con permisos de edición
                  <span class="font-normal text-base-content/70">
                    (Puede modificar información de bancos y reactivos)
                  </span>
                </p>

                <p class="text-sm text-base-content/70">
                  El usuario podrá editar la información del banco y sus reactivos.
                </p>
              </div>
            </label>
          </div>
        </div>
      </div>

      <!-- Información banco -->
      <div class="lg:col-span-4">
        <div class="card bg-primary/5 border border-primary/20 shadow-sm h-fit">
          <div class="card-body">
            <div class="flex items-center gap-2 text-primary mb-2">
              <i class="fa-solid fa-circle-info"></i>
              <span class="font-semibold"> Información del banco </span>
            </div>

            <div class="space-y-3">
              <div>
                <p class="text-sm text-base-content/70">Nombre del banco:</p>

                <p class="font-bold">Examen Matemáticas 1</p>
              </div>

              <div>
                <p class="text-sm text-base-content/70">Reactivos:</p>

                <p class="font-medium">50</p>
              </div>

              <div>
                <p class="text-sm text-base-content/70">Fecha de creación:</p>

                <p class="font-medium">15/05/2025</p>
              </div>

              <div>
                <p class="text-sm text-base-content/70">Descripción:</p>

                <p>Banco de reactivos para el examen de matemáticas – Unidad 1.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const busqueda = ref('')
const permiso = ref('lectura')
</script>
