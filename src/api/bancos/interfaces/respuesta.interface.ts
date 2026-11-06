import type { Idioma } from './reactivo.interface'
import type { Propietario } from './banco.interface'

export interface Respuesta {
  idRespuesta: string
  idReactivo: string
  version: number
  posicion: number
  respuesta: string
  esCorrecta: boolean
  fechaCreacion: string
  fechaModificacion: string
  creadoPor: Propietario
  modificadoPor: Propietario
  idioma: Idioma
}
