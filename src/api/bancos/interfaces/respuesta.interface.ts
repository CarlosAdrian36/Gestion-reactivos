import type { Idioma } from './reactivo.interface'

export interface Respuesta {
  idRespuesta: string
  idReactivo: string
  version: number
  posicion: number
  respuesta: string
  esCorrecta: boolean
  fechaCreacion: string
  fechaModificacion: string
  idioma: Idioma
}
