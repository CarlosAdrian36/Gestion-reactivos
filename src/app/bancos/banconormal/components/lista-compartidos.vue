<template>
  <div class="flex flex-col h-full">
    <!-- Encabezado -->
    <div class="flex flex-row items-center mb-4">
      <i class="fa-regular fa-user-gear text-primary pe-2"></i>

      <h2 class="text-xs font-bold uppercase tracking-widest">Banco Compartido</h2>
    </div>

    <!-- Lista -->
    <div class="flex-1 overflow-y-auto max-h-96 pr-2 space-y-4">
      <div v-if="data?.compartidos.length === 0">
        <div class="w-20 h-20 rounded-full bg-base-200 flex items-center justify-center mb-5">
          <i class="fa-regular fa-user-group text-4xl text-base-content/40"></i>
        </div>

        <h2 class="text-lg font-bold">Este banco aún no se ha compartido</h2>

        <p class="text-sm text-base-content/60 mt-2 max-w-xs">
          Comparte este banco con otros usuarios para que puedan consultarlo o editarlo.
        </p>
      </div>
      <div
        v-else
        v-for="value in data?.compartidos"
        :key="value.idCuenta"
        class="flex items-center justify-between"
      >
        <div class="flex items-center gap-3">
          <div
            class="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold"
          >
            {{ value.identidad.nombre.charAt(0).toUpperCase() }}
            {{ value.identidad.apellidoPaterno.charAt(0).toUpperCase() }}
          </div>

          <div>
            fsdf
            <p class="text-xs font-semibold">
              {{ value.identidad.nombre }}
              {{ value.identidad.apellidoPaterno }}
              {{ value.identidad.apellidoMaterno }}
            </p>

            <select
              :value="value.permiso.edicion ? 'editor' : 'lector'"
              @change="cambiarPermiso(value.idCuenta, ($event.target as HTMLSelectElement).value)"
              class="select select-xs select-bordered mt-1 w-32"
            >
              <option value="editor">Editor</option>
              <option value="lector">Solo lectura</option>
            </select>
          </div>
        </div>

        <button class="cursor-pointer text-slate-400 hover:text-error transition-colors">
          <i class="fa-regular fa-user-minus"></i>
        </button>
      </div>
    </div>

    <!-- Botón -->
    <div class="pt-5 mt-auto">
      <button
        class="btn btn-dash btn-block btn-sm rounded-lg border-dashed hover:border-primary hover:text-primary hover:bg-base-100"
      >
        Compartir
      </button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { getListaPersonasCompartidas } from '@/api/bancos/compartidos/actions/get-banco-compartidos.action'
import { useQuery } from '@tanstack/vue-query'

const props = defineProps<{
  bancoId: number
}>()

const { data } = useQuery({
  queryKey: ['ListaPersonasCompartidas', props.bancoId],
  queryFn: () => getListaPersonasCompartidas(String(props.bancoId)),
})

import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { actualizarPermiso } from '@/api/bancos/compartidos/actions/update-permisos.action'

const queryClient = useQueryClient()

const mutation = useMutation({
  mutationFn: ({ idCuenta, edicion }: { idCuenta: string; edicion: boolean }) =>
    actualizarPermiso(props.bancoId, idCuenta, {
      edicion,
    }),

  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: ['ListaPersonasCompartidas', props.bancoId],
    })
  },
})

const cambiarPermiso = (idCuenta: string, permiso: string) => {
  mutation.mutate({
    idCuenta,
    edicion: permiso === 'editor',
  })
}
</script>
