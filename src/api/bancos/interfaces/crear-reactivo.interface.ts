export interface CrearReactivoRequest {
  idiomaId: number
  nivelCognitivoId: number
  subTemaId: number
  tipoReactivoId: number
  descripcion: string
}

export interface CrearReactivoResponse {
  reactivo: {
    idReactivo: string
  }
}

export interface CrearRespuestaRequest {
  idiomaId: number
  posicion: number
  esCorrecta: boolean
  respuesta: string
}

export interface CrearRespuestaResponse {
  respuestaCreada: boolean
}
