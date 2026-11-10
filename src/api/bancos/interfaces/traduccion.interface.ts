import type { Reactivo } from './reactivo.interface'
import type { Respuesta } from './respuesta.interface'

export interface CrearTraduccionReactivoRequest {
  descripcion: string
}

export interface CrearTraduccionReactivoResponse {
  reactivo: Reactivo
}

export interface CrearTraduccionRespuestaRequest {
  esCorrecta: boolean
  respuesta: string
}

export interface CrearTraduccionRespuestaResponse {
  respuesta: Respuesta
}

export interface RespuestaTraduccionInput extends CrearTraduccionRespuestaRequest {
  idRespuesta: string
}
