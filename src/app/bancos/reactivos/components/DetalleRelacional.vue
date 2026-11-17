<script setup lang="ts">
import { computed } from 'vue'
import { useInstruccionesGrupos } from '@/api/bancos/composable/useInstruccionesGrupos'
import { useRespuestasGrupo } from '@/api/bancos/composable/useRespuestasGrupo'
import type { Reactivo } from '@/api/bancos/interfaces/reactivo.interface'
import type { Respuesta } from '@/api/bancos/interfaces/respuesta.interface'

/**
 * Vista del tipo 5 (Relacional): instrucción del grupo y tabla de
 * reactivos del grupo con sus respuestas. Carga sus propios datos
 * (solo se monta cuando el reactivo seleccionado es de este tipo).
 */
const props = defineProps<{
  bancoId: string
  /** Número de grupo al que pertenece el reactivo seleccionado. */
  grupo: number
  /** Todos los reactivos del banco (para filtrar los del grupo). */
  reactivos: Reactivo[]
}>()

const { data: instrucciones } = useInstruccionesGrupos(props.bancoId, () => props.grupo > 0)

const instruccionGrupo = computed(() => {
  if (!props.grupo) return ''
  return instrucciones.value?.find((i) => i.grupo === props.grupo)?.descripcion ?? ''
})

const reactivosGrupo = computed(() => {
  if (!props.grupo) return []
  return props.reactivos
    .filter((r) => r.grupo === props.grupo)
    .sort((a, b) => a.posicionGrupo - b.posicionGrupo)
})

const grupoReactivoIds = computed(() => reactivosGrupo.value.map((r) => r.idReactivo))
const { respuestasMap: respuestasGrupoMap, isLoading: cargandoRespuestasGrupo } =
  useRespuestasGrupo(props.bancoId, grupoReactivoIds)

function getRespuestasReactivo(idReactivo: string): Respuesta[] {
  return [...(respuestasGrupoMap.value.get(idReactivo) ?? [])].sort(
    (a, b) => a.posicion - b.posicion,
  )
}
</script>

<template>
  <div class="space-y-6">
    <!-- Instrucción del grupo -->
    <div class="space-y-3">
      <h3
        class="text-xs font-bold uppercase tracking-wider text-base-content/60 flex items-center gap-2"
      >
        <i class="fa-regular fa-arrow-right-arrow-left text-[14px]"></i>
        Instrucción del grupo
      </h3>
      <div class="bg-base-200 rounded-xl p-6">
        <div
          class="fr-view text-lg text-base-content leading-relaxed [&_p]:m-0"
          v-html="instruccionGrupo || '<em>Sin instrucción</em>'"
        ></div>
      </div>
    </div>

    <!-- Tabla de reactivos del grupo -->
    <div class="space-y-3">
      <h3
        class="text-xs font-bold uppercase tracking-wider text-base-content/60 flex items-center gap-2"
      >
        <i class="fa-regular fa-list text-[14px]"></i>
        Reactivos del grupo
      </h3>

      <div v-if="cargandoRespuestasGrupo" class="space-y-2">
        <div class="skeleton h-12 w-full rounded-xl"></div>
        <div class="skeleton h-12 w-full rounded-xl"></div>
      </div>

      <div v-else-if="reactivosGrupo.length" class="overflow-x-auto">
        <table class="table table-bordered table-fixed w-full">
          <thead>
            <tr>
              <th class="bg-base-200 text-xs font-semibold uppercase tracking-wider w-[40%]">
                <span class="flex items-center gap-2">
                  <i class="fa-regular fa-pen-to-square text-[14px]"></i>
                  Reactivo
                </span>
              </th>
              <th class="bg-base-200 text-xs font-semibold uppercase tracking-wider w-[60%]">
                <span class="flex items-center gap-2">
                  <i class="fa-regular fa-circle-check text-[14px]"></i>
                  Respuestas
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="reactivo in reactivosGrupo" :key="reactivo.idReactivo">
              <td>
                <div
                  class="fr-view min-w-0 text-sm text-base-content leading-relaxed wrap-anywhere [&_p]:m-0"
                  v-html="reactivo.descripcion"
                ></div>
              </td>
              <td>
                <div class="space-y-1.5">
                  <div
                    v-for="(r, i) in getRespuestasReactivo(reactivo.idReactivo)"
                    :key="r.idRespuesta"
                    class="flex items-center gap-2 text-sm"
                  >
                    <span
                      class="size-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                      :class="
                        r.esCorrecta
                          ? 'bg-success text-success-content'
                          : 'bg-base-300 text-base-content/60'
                      "
                    >
                      {{ r.esCorrecta ? '✓' : String.fromCharCode(65 + i) }}
                    </span>
                    <span
                      class="fr-view min-w-0 flex-1 wrap-anywhere [&_p]:m-0"
                      :class="r.esCorrecta ? 'text-success font-medium' : 'text-base-content'"
                      v-html="r.respuesta"
                    ></span>
                  </div>
                  <p
                    v-if="!getRespuestasReactivo(reactivo.idReactivo).length"
                    class="text-xs text-base-content/40 italic"
                  >
                    Sin respuestas
                  </p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p v-else class="text-sm text-base-content/40">Sin reactivos en el grupo</p>
    </div>
  </div>
</template>
