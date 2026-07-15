<script lang="ts" setup>
import type { Banco } from '@/api/bancos/interfaces/banco.interface'

defineProps<{
  banco: Banco
}>()
</script>

<template>
  <div class="p-6">
    <div class="flex flex-row items-center mb-4">
      <i class="fa-regular fa-circle-info text-primary pe-2"></i>

      <h2 class="text-xs font-bold uppercase tracking-widest">Informacion general</h2>
    </div>

    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="avatar">
            <i class="fa-light fa-list-ol"></i>
          </div>
          <div>
            <p class="text-xs font-semibold">Numero de Reactivos: {{ banco.cantidadReactivos }}</p>
          </div>
        </div>
      </div>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="avatar">
            <i class="fa-light fa-user-crown"></i>
          </div>
          <div>
            <p class="text-xs font-semibold">
              Propietario del banco: {{ banco.propietario.nombre }}
              {{ banco.propietario.apellidoPaterno }}
              {{ banco.propietario.apellidoMaterno }}
            </p>
          </div>
        </div>
      </div>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="avatar">
            <i class="fa-light fa-calendar-circle-plus"></i>
          </div>
          <div>
            <p class="text-xs font-semibold">
              Fecha de creacion:
              {{
                new Date(banco.fechaCreacion).toLocaleDateString('es-ES', {
                  dateStyle: 'medium',
                })
              }}
            </p>
          </div>
        </div>
      </div>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="avatar">
            <i class="fa-light fa-calendar-lines-pen"></i>
          </div>
          <div>
            <p class="text-xs font-semibold">
              Fecha de modificacion :
              {{
                new Date(banco.fechaModificacion).toLocaleDateString('es-ES', {
                  dateStyle: 'medium',
                })
              }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
