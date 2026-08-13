<template>
  <div class="flex flex-col h-full">
    <!-- Encabezado -->
    <div class="flex flex-row items-center mb-4">
      <i class="fa-regular fa-user-gear text-primary pe-2"></i>

      <h2 class="text-xs font-bold uppercase tracking-widest">Compartido con</h2>
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
            class="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-base font-bold"
          >
            {{ value.nombre.charAt(0).toUpperCase()
            }}{{ value.apellidoPaterno.charAt(0).toUpperCase() }}
          </div>

          <div>
            <p class="text-xs font-semibold">
              {{ value.nombre }}
              {{ value.apellidoPaterno }}
              {{ value.apellidoMaterno }}
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

        <button
          class="cursor-pointer text-slate-400 hover:text-error transition-colors"
          @click="quitarCompartido(value.idCuenta)"
          :disabled="eliminarMutation.isPending.value"
        >
          <i class="fa-regular fa-user-minus"></i>
        </button>
      </div>
    </div>

    <!-- Botón -->
    <div class="pt-5 mt-auto">
      <!-- <button
        class="btn btn-dash btn-block btn-sm rounded-lg border-dashed hover:border-primary hover:text-primary hover:bg-base-100"
        @click.stop="Compartirbanco(banco)"
      >
        Compartir
      </button> -->
    </div>
    <button class="btn btn-dash btn-primary btn-sm" @click.stop="Compartirbanco(banco)">
      Compartir
    </button>
  </div>
</template>
<script lang="ts" setup>
import { getListaPersonasCompartidas } from '@/api/bancos/compartidos/actions/get-banco-compartidos.action'
import { useQuery } from '@tanstack/vue-query'

const props = defineProps<{
  banco: Banco
}>()

const { data } = useQuery({
  queryKey: ['ListaPersonasCompartidas', props.banco.idBanco],
  queryFn: () => getListaPersonasCompartidas(props.banco.idBanco),
})

import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { actualizarPermiso } from '@/api/bancos/compartidos/actions/update-permisos.action'
import { eliminarCompartido } from '@/api/bancos/compartidos/actions/delete-compartido.action'
import { toast } from 'vue-sonner'
import type { Banco } from '@/api/bancos/interfaces/banco.interface'
import { useModalStore } from '@/common/modals/store/modal.store'
import CompartirBanco from '@/app/common/components/modals/CompartirBanco.vue'

const queryClient = useQueryClient()

const mutation = useMutation({
  mutationFn: ({ idCuenta, edicion }: { idCuenta: string; edicion: boolean }) =>
    actualizarPermiso(props.banco.idBanco, idCuenta, {
      edicion,
    }),

  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: ['ListaPersonasCompartidas', props.banco.idBanco],
    })
  },
})

const cambiarPermiso = (idCuenta: string, permiso: string) => {
  toast.promise(
    mutation.mutateAsync({
      idCuenta,
      edicion: permiso === 'editor',
    }),
    {
      loading: 'Actualizando permiso...',
      success: 'Permiso actualizado.',
      error: 'No fue posible actualizar el permiso.',
    },
  )
}

const eliminarMutation = useMutation({
  mutationFn: (idCuenta: string) => eliminarCompartido(props.banco.idBanco, idCuenta),

  onSuccess: () => {
    // toast.success('Usuario eliminado correctamente')

    queryClient.invalidateQueries({
      queryKey: ['ListaPersonasCompartidas', props.banco.idBanco],
    })
  },

  onError: () => {
    toast.error('No fue posible eliminar al usuario')
  },
})

const quitarCompartido = (idCuenta: string) => {
  toast.promise(
    (async () => {
      await eliminarMutation.mutateAsync(idCuenta)

      await queryClient.invalidateQueries({
        queryKey: ['ListaPersonasCompartidas', props.banco.idBanco],
      })
    })(),
    {
      loading: 'Eliminando usuario...',
      success: 'Usuario eliminado correctamente.',
      error: 'No fue posible eliminar al usuario.',
    },
  )
}
function closeDropdown() {
  ;(document.activeElement as HTMLElement)?.blur()
}
const modal = useModalStore()
async function Compartirbanco(Banco: Banco) {
  closeDropdown()
  modal.openModal(
    CompartirBanco,
    // console.log('Seejecuto el; invalidteSds!!!!!!!!!!!'),
    {
      banco: Banco,
    },
    [
      { label: 'Cerrar', variant: 'outline' },
      { label: 'Compartir', variant: 'primary', type: 'submit' },
    ],
    'max-w-5xl',
  )
}
</script>
