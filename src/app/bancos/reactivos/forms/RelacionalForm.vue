<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { z } from 'zod'
import { toast } from 'vue-sonner'
import FroalaEditor from '@/components/FroalaEditor.vue'
import {
  useGuardarRelacional,
  type ReactivoRelacionalForm,
  type RespuestaRelacionalForm,
} from '@/api/bancos/composable/useGuardarRelacional'
import { useInstruccionesGrupos } from '@/api/bancos/composable/useInstruccionesGrupos'
import { useReactivos } from '@/api/bancos/composable/useReactivos'
import { getRespuestasAction } from '@/api/bancos/actions/get-respuestas.action'

const props = defineProps<{
  grupoId?: number
}>()

const route = useRoute()
const bancoId = route.params.id as string
const { isGuardando, guardarGrupo } = useGuardarRelacional(bancoId, props.grupoId)

const cargandoGrupo = ref(false)
const instruccion = ref('')
const reactivos = ref<ReactivoRelacionalForm[]>([])
const idsReactivoActuales = ref<string[]>([])

const reactivoSchema = z.object({
  descripcion: z.string().trim().min(1, 'El reactivo debe tener al menos 1 carácter'),
  respuestas: z
    .array(
      z.object({
        texto: z.string().trim().min(1, 'La respuesta debe tener al menos 1 carácter'),
        correcta: z.boolean(),
      }),
    )
    .min(1, 'Cada reactivo debe tener al menos 1 respuesta')
    .refine((respuestas) => respuestas.some((r) => r.correcta), {
      message: 'Debe haber exactamente 1 respuesta correcta',
    }),
})

const erroresReactivo = ref<string[]>([])
const erroresRespuesta = ref<Record<number, string[]>>({})

onMounted(async () => {
  if (!props.grupoId) {
    reactivos.value = [
      { descripcion: '', respuestas: [{ texto: '', correcta: true }] },
      { descripcion: '', respuestas: [{ texto: '', correcta: true }] },
    ]
    return
  }

  cargandoGrupo.value = true
  try {
    const { data: instrucciones } = useInstruccionesGrupos(bancoId)
    const { data: listaReactivos } = useReactivos(bancoId)

    await Promise.all([instrucciones, listaReactivos])

    const instruccionGrupo = instrucciones.value?.find(
      (i) => i.grupo === props.grupoId,
    )
    instruccion.value = instruccionGrupo?.descripcion ?? ''

    const reactivosGrupo = (listaReactivos.value ?? [])
      .filter((r) => r.grupo === props.grupoId)
      .sort((a, b) => a.posicionGrupo - b.posicionGrupo)

    idsReactivoActuales.value = reactivosGrupo.map((r) => r.idReactivo)

    const reactivosCargados: ReactivoRelacionalForm[] = []
    for (const reactivo of reactivosGrupo) {
      const respuestas = await getRespuestasAction(bancoId, reactivo.idReactivo)
      const respuestasOrdenadas: RespuestaRelacionalForm[] = respuestas
        .sort((a, b) => a.posicion - b.posicion)
        .map((r) => ({
          idRespuesta: r.idRespuesta,
          texto: r.respuesta,
          correcta: r.esCorrecta,
        }))

      if (respuestasOrdenadas.length === 0) {
        respuestasOrdenadas.push({ idRespuesta: undefined, texto: '', correcta: true })
      }

      reactivosCargados.push({
        idReactivo: reactivo.idReactivo,
        descripcion: reactivo.descripcion,
        respuestas: respuestasOrdenadas,
      })
    }

    reactivos.value =
      reactivosCargados.length > 0
        ? reactivosCargados
        : [
            { descripcion: '', respuestas: [{ texto: '', correcta: true }] },
            { descripcion: '', respuestas: [{ texto: '', correcta: true }] },
          ]
  } catch {
    toast.error('Error al cargar los datos del grupo')
    reactivos.value = [
      { descripcion: '', respuestas: [{ texto: '', correcta: true }] },
      { descripcion: '', respuestas: [{ texto: '', correcta: true }] },
    ]
  } finally {
    cargandoGrupo.value = false
  }
})

function seleccionarCorrecta(reactivoIndex: number, respuestaIndex: number) {
  const reactivo = reactivos.value[reactivoIndex]
  if (!reactivo) return
  reactivo.respuestas.forEach((r, i) => {
    r.correcta = i === respuestaIndex
  })
}

function agregarReactivo() {
  if (reactivos.value.length < 26) {
    reactivos.value.push({
      descripcion: '',
      respuestas: [{ texto: '', correcta: true }],
    })
  }
}

function quitarReactivo(index: number) {
  if (reactivos.value.length > 2) {
    reactivos.value.splice(index, 1)
    delete erroresReactivo.value[index]
  }
}

function agregarRespuesta(reactivoIndex: number) {
  const reactivo = reactivos.value[reactivoIndex]
  if (reactivo && reactivo.respuestas.length < 10) {
    reactivo.respuestas.push({ texto: '', correcta: false })
  }
}

function quitarRespuesta(reactivoIndex: number, respuestaIndex: number) {
  const reactivo = reactivos.value[reactivoIndex]
  if (reactivo && reactivo.respuestas.length > 1) {
    const eraCorrecta = reactivo.respuestas[respuestaIndex]?.correcta
    reactivo.respuestas.splice(respuestaIndex, 1)
    if (eraCorrecta && reactivo.respuestas.length > 0) {
      reactivo.respuestas[0]!.correcta = true
    }
    const errs = erroresRespuesta.value[reactivoIndex]
    if (errs) errs.splice(respuestaIndex, 1)
  }
}

function validar(): boolean {
  let valido = true
  const nuevosErroresReactivo: string[] = []
  const nuevosErroresRespuesta: Record<number, string[]> = []

  if (!instruccion.value.trim()) {
    toast.error('La instrucción no puede estar vacía')
    return false
  }

  for (let i = 0; i < reactivos.value.length; i++) {
    const reactivo = reactivos.value[i]!
    const result = reactivoSchema.safeParse(reactivo)

    if (!result.success) {
      valido = false
      const msg = result.error.issues[0]?.message ?? 'Error'
      nuevosErroresReactivo[i] = msg

      const errsResp: string[] = []
      for (let j = 0; j < reactivo.respuestas.length; j++) {
        const respIssue = result.error.issues.find(
          (issue) => issue.path[0] === 'respuestas' && issue.path[1] === j,
        )
        errsResp[j] = respIssue?.message ?? ''
      }
      nuevosErroresRespuesta[i] = errsResp
    } else {
      nuevosErroresReactivo[i] = ''
      nuevosErroresRespuesta[i] = reactivo.respuestas.map(() => '')
    }
  }

  erroresReactivo.value = nuevosErroresReactivo
  erroresRespuesta.value = nuevosErroresRespuesta

  if (!valido) {
    toast.error('Corrige los errores antes de guardar')
  }

  return valido
}

async function guardarForm() {
  if (!validar()) return
  await guardarGrupo(
    instruccion.value,
    reactivos.value.map((r) => ({
      idReactivo: r.idReactivo,
      descripcion: r.descripcion,
      respuestas: r.respuestas.map((resp) => ({
        idRespuesta: resp.idRespuesta,
        texto: resp.texto,
        correcta: resp.correcta,
      })),
    })),
    idsReactivoActuales.value,
  )
}

const instruccionConfig = {
  quickInsertEnabled: false,
  toolbarButtons: [
    'bold',
    'italic',
    'underline',
    '|',
    'fontFamily',
    'fontSize',
    '|',
    'textColor',
    'backgroundColor',
    '|',
    'alignLeft',
    'alignCenter',
    'alignRight',
    '|',
    'insertTable',
    '|',
    'outdent',
    'indent',
    '|',
    'formatOL',
    'formatUL',
    '|',
    'clearFormatting',
    '|',
    'undo',
    'redo',
  ],
  placeholderText: 'Escribe la instrucción del grupo aquí...',
  heightMin: 120,
  charCounterCount: true,
}

const reactivoConfig = {
  toolbarInline: false,
  toolbarButtons: ['bold', 'italic', 'underline', '|', 'undo', 'redo'],
  toolbarButtonsSM: ['bold', 'italic'],
  toolbarButtonsXS: ['bold'],
  placeholderText: 'Reactivo',
  heightMin: 80,
  heightMax: 120,
  quickInsertEnabled: false,
  toolbarSticky: false,
}

const respuestaConfig = {
  toolbarInline: false,
  toolbarButtons: ['bold', 'italic', 'underline', '|', 'undo', 'redo'],
  toolbarButtonsSM: ['bold', 'italic'],
  toolbarButtonsXS: ['bold'],
  placeholderText: 'Respuesta',
  heightMin: 60,
  heightMax: 100,
  quickInsertEnabled: false,
  toolbarSticky: false,
}
</script>

<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold">Relacional</h2>

    <div v-if="cargandoGrupo" class="space-y-4">
      <div class="skeleton h-32 w-full rounded-xl"></div>
      <div class="skeleton h-48 w-full rounded-xl"></div>
    </div>

    <template v-else>
      <div>
        <label class="label font-semibold">Instrucción del grupo</label>
        <FroalaEditor v-model="instruccion" :config="instruccionConfig" />
      </div>

      <div>
        <div class="flex items-center justify-between mb-2">
          <label class="label font-semibold">Reactivos y respuestas</label>
          <button
            v-if="reactivos.length < 26"
            class="btn btn-ghost btn-xs gap-1"
            @click="agregarReactivo"
          >
            <i class="fa-regular fa-plus"></i>
            Agregar reactivo
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="table table-bordered w-full">
            <thead>
              <tr>
                <th class="w-[40%] bg-base-200 text-xs font-semibold uppercase tracking-wider">
                  <span class="flex items-center gap-2">
                    <i class="fa-regular fa-pen-to-square text-[14px]"></i>
                    Reactivo (Columna A)
                  </span>
                </th>
                <th class="w-[55%] bg-base-200 text-xs font-semibold uppercase tracking-wider">
                  <span class="flex items-center gap-2">
                    <i class="fa-regular fa-list text-[14px]"></i>
                    Respuestas (Columna B)
                  </span>
                </th>
                <th class="w-[5%] bg-base-200"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(reactivo, rIndex) in reactivos" :key="rIndex">
                <td class="align-top">
                  <FroalaEditor
                    v-model="reactivo.descripcion"
                    :config="{
                      ...reactivoConfig,
                      placeholderText: `Reactivo ${String.fromCharCode(65 + rIndex)}`,
                    }"
                  />
                  <p v-if="erroresReactivo[rIndex]" class="text-error text-xs mt-1">
                    {{ erroresReactivo[rIndex] }}
                  </p>
                </td>
                <td class="align-top">
                  <div class="space-y-2">
                    <div
                      v-for="(respuesta, respIndex) in reactivo.respuestas"
                      :key="respIndex"
                      class="flex items-center gap-2"
                    >
                      <button
                        class="btn btn-xs cursor-pointer select-none transition-colors shrink-0 min-w-16 justify-center"
                        :class="
                          respuesta.correcta
                            ? 'btn-success text-success-content border-success'
                            : 'btn-outline border-base-300'
                        "
                        @click="seleccionarCorrecta(rIndex, respIndex)"
                      >
                        <i
                          :class="
                            respuesta.correcta
                              ? 'fa-solid fa-circle-check'
                              : 'fa-regular fa-circle'
                          "
                        ></i>
                        {{ respuesta.correcta ? 'Correcta' : 'Correcta' }}
                      </button>

                      <div class="flex-1 min-w-0">
                        <FroalaEditor
                          v-model="respuesta.texto"
                          :config="{
                            ...respuestaConfig,
                            placeholderText: `Respuesta ${respIndex + 1}`,
                          }"
                        />
                        <p
                          v-if="erroresRespuesta[rIndex]?.[respIndex]"
                          class="text-error text-xs mt-1"
                        >
                          {{ erroresRespuesta[rIndex]![respIndex] }}
                        </p>
                      </div>
                      <button
                        class="btn btn-ghost btn-xs text-error shrink-0"
                        :class="reactivo.respuestas.length > 1 ? '' : 'invisible'"
                        @click="quitarRespuesta(rIndex, respIndex)"
                      >
                        <i class="fa-regular fa-trash"></i>
                      </button>
                    </div>
                    <button
                      v-if="reactivo.respuestas.length < 10"
                      class="btn btn-ghost btn-xs gap-1 text-primary"
                      @click="agregarRespuesta(rIndex)"
                    >
                      <i class="fa-regular fa-plus"></i>
                      Agregar respuesta
                    </button>
                  </div>
                </td>
                <td class="align-top pt-4">
                  <button
                    class="btn btn-ghost btn-xs text-error"
                    :class="reactivos.length > 2 ? '' : 'invisible'"
                    @click="quitarReactivo(rIndex)"
                  >
                    <i class="fa-regular fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="flex gap-3 pt-4">
        <button class="btn btn-primary" :disabled="isGuardando" @click="guardarForm">
          <span v-if="isGuardando" class="loading loading-spinner"></span>
          {{ isGuardando ? 'Guardando...' : 'Guardar' }}
        </button>
      </div>
    </template>
  </div>
</template>
