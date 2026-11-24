<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { toast } from 'vue-sonner'
import { useRespuestas } from '@/api/bancos/composable/useRespuestas'
import { useGuardarTraduccion } from '@/api/bancos/composable/useGuardarTraduccion'
import { useActualizarTraduccion } from '@/api/bancos/composable/useActualizarTraduccion'
import type { RespuestaTraduccionInput } from '@/api/bancos/interfaces/traduccion.interface'
import type { Reactivo } from '@/api/bancos/interfaces/reactivo.interface'
import type { Respuesta } from '@/api/bancos/interfaces/respuesta.interface'
import { stripHtmlToText } from '@/utils/html'
import FroalaEditor from '@/components/FroalaEditor.vue'
import TraduccionPreview from './TraduccionPreview.vue'
import { opcionConfig } from '../forms/froalaConfig'

export interface TraduccionActual {
  idReactivo: string
  descripcion: string
  respuestas: Respuesta[]
}

const props = defineProps<{
  bancoId: string
  /** Reactivo original (es_MX) del que se parte para traducir. */
  reactivo: Reactivo
  /** Etiqueta del idioma destino, p. ej. 'en_US'. */
  idioma: string
  /** Traducción existente; si viene, el editor precarga y actualiza (en vez de crear). */
  traduccionActual?: TraduccionActual
}>()

const emit = defineEmits<{
  cancelar: []
  guardado: []
}>()

const esActualizacion = computed(() => !!props.traduccionActual)

// Respuestas originales (sin header Idioma) para mostrar el original a la par.
const { data: respuestasOriginales, isLoading: cargandoRespuestas } = useRespuestas(
  props.bancoId,
  () => props.reactivo.idReactivo,
  undefined,
)

const respuestasOrdenadas = computed(() =>
  [...(respuestasOriginales.value ?? [])].sort((a, b) => a.posicion - b.posicion),
)

const descripcionTraducida = ref('')
const traduccionesRespuestas = ref<Record<string, string>>({})

// Al cambiar de reactivo o idioma se limpia el formulario.
watch(
  () => [props.reactivo.idReactivo, props.idioma] as const,
  () => {
    descripcionTraducida.value = ''
    traduccionesRespuestas.value = {}
  },
  { immediate: true },
)

// Precarga (modo actualizar): llena descripción y respuestas traducidas
// casando por posición con las respuestas originales.
watch(
  respuestasOrdenadas,
  (ordenadas) => {
    const actual = props.traduccionActual
    if (!actual) return
    descripcionTraducida.value = actual.descripcion
    const porPosicion = new Map<number, Respuesta>()
    for (const r of actual.respuestas) porPosicion.set(r.posicion, r)
    const mapa: Record<string, string> = {}
    for (const original of ordenadas) {
      const texto = porPosicion.get(original.posicion)?.respuesta
      if (texto != null) mapa[original.idRespuesta] = texto
    }
    traduccionesRespuestas.value = mapa
  },
  { immediate: true },
)

const guardarTraduccion = useGuardarTraduccion(props.bancoId)
const actualizarTraduccion = useActualizarTraduccion(props.bancoId)
const guardando = computed(
  () => guardarTraduccion.isPending.value || actualizarTraduccion.isPending.value,
)

async function guardar() {
  if (!stripHtmlToText(descripcionTraducida.value)) {
    toast.error('Escribe la traducción del enunciado antes de guardar')
    return
  }

  try {
    if (esActualizacion.value) {
      // Actualizar: los PUT apuntan al reactivo traducido y sus respuestas.
      const respuestasActualizadas = respuestasOrdenadas.value
        .map((original) => {
          const traducida = props.traduccionActual!.respuestas.find(
            (r) => r.posicion === original.posicion,
          )
          return {
            idRespuesta: traducida?.idRespuesta ?? '',
            esCorrecta: traducida?.esCorrecta ?? original.esCorrecta,
            respuesta: traduccionesRespuestas.value[original.idRespuesta] ?? '',
          }
        })
        .filter((item) => item.idRespuesta && stripHtmlToText(item.respuesta) !== '')

      await actualizarTraduccion.mutateAsync({
        idReactivoOriginal: props.reactivo.idReactivo,
        idReactivoTraducido: props.traduccionActual!.idReactivo,
        idioma: props.idioma,
        tipoReactivoId: props.reactivo.tipoReactivoId,
        descripcion: descripcionTraducida.value,
        respuestas: respuestasActualizadas,
      })
      toast.success('Traducción actualizada correctamente')
    } else {
      const respuestas: RespuestaTraduccionInput[] = respuestasOrdenadas.value
        .map((respuesta: Respuesta) => ({
          idRespuesta: respuesta.idRespuesta,
          esCorrecta: respuesta.esCorrecta,
          respuesta: traduccionesRespuestas.value[respuesta.idRespuesta] ?? '',
        }))
        .filter((item) => stripHtmlToText(item.respuesta) !== '')

      await guardarTraduccion.mutateAsync({
        idReactivo: props.reactivo.idReactivo,
        idioma: props.idioma,
        descripcion: descripcionTraducida.value,
        respuestas,
      })
      toast.success('Traducción guardada correctamente')
    }
    emit('guardado')
  } catch (error) {
    toast.error(
      error instanceof Error
        ? error.message
        : esActualizacion.value
          ? 'No se pudo actualizar la traducción'
          : 'No se pudo guardar la traducción',
    )
  }
}
</script>

<template>
  <div class="p-8 space-y-6">
    <div
      class="flex items-center gap-3 rounded-xl border border-warning/40 bg-warning/10 px-4 py-3"
    >
      <i class="fa-regular fa-language text-[18px] text-warning"></i>
      <div class="min-w-0">
        <p class="text-sm font-semibold text-warning">
          {{ esActualizacion ? 'Actualizando traducción a' : 'Traduciendo a' }} {{ props.idioma }}
        </p>
        <p class="text-xs text-base-content/60">
          Escribe la traducción junto al original y guárdala.
        </p>
      </div>
    </div>

    <!-- Enunciado: original vs traducción -->
    <div class="space-y-3">
      <h3
        class="text-xs font-bold uppercase tracking-wider text-base-content/60 flex items-center gap-2"
      >
        <i class="fa-regular fa-file-lines text-[14px]"></i>
        Descripción / Enunciado
      </h3>
      <TraduccionPreview v-model="descripcionTraducida" :original="props.reactivo.descripcion" />
    </div>

    <!-- Respuestas: original vs traducción -->
    <div v-if="respuestasOrdenadas.length" class="space-y-3">
      <h3
        class="text-xs font-bold uppercase tracking-wider text-base-content/60 flex items-center gap-2"
      >
        <i class="fa-regular fa-list-check text-[14px]"></i>
        Respuestas
      </h3>
      <div v-if="cargandoRespuestas" class="space-y-2">
        <div class="skeleton h-14 w-full rounded-xl"></div>
        <div class="skeleton h-14 w-full rounded-xl"></div>
      </div>
      <div v-else class="space-y-4">
        <div
          v-for="(respuesta, i) in respuestasOrdenadas"
          :key="respuesta.idRespuesta"
          class="overflow-hidden rounded-xl border border-base-300"
        >
          <div class="flex items-center gap-2 bg-base-200 px-4 py-2">
            <span
              class="size-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
              :class="
                respuesta.esCorrecta
                  ? 'bg-success text-success-content'
                  : 'bg-base-300 text-base-content/60'
              "
            >
              {{ respuesta.esCorrecta ? '✓' : String.fromCharCode(65 + i) }}
            </span>
            <span class="text-xs font-semibold uppercase tracking-wider text-base-content/50">
              Opción {{ String.fromCharCode(65 + i) }}
            </span>
          </div>
          <div
            class="grid grid-cols-1 divide-y divide-base-300 md:grid-cols-2 md:divide-x md:divide-y-0"
          >
            <section class="min-w-0 p-4">
              <h4
                class="mb-2 text-[11px] font-semibold uppercase tracking-wider text-base-content/50"
              >
                Original
              </h4>
              <div
                class="fr-view text-sm leading-relaxed text-base-content [&_p]:m-0"
                v-html="respuesta.respuesta"
              ></div>
            </section>
            <section class="min-w-0">
              <FroalaEditor
                v-model="traduccionesRespuestas[respuesta.idRespuesta]"
                :config="{ ...opcionConfig, placeholderText: 'Escribe la traducción aquí...' }"
              />
            </section>
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-end gap-3 pt-2">
      <button
        type="button"
        class="btn btn-ghost btn-sm"
        :disabled="guardando"
        @click="emit('cancelar')"
      >
        Cancelar
      </button>
      <button
        type="button"
        class="btn btn-warning btn-sm gap-2"
        :disabled="guardando || cargandoRespuestas"
        @click="guardar"
      >
        <span v-if="guardando" class="loading loading-spinner loading-xs"></span>
        <i v-else class="fa-regular fa-language text-[14px]"></i>
        {{
          guardando
            ? 'Guardando…'
            : esActualizacion
              ? 'Actualizar traducción'
              : 'Guardar traducción'
        }}
      </button>
    </div>
  </div>
</template>
