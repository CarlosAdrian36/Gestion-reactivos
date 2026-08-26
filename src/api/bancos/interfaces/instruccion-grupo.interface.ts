export interface InstruccionGrupo {
  grupo: number
  descripcion: string
  fechaCreacion: string
  fechaModificacion: string
}

export interface CrearInstruccionGrupoRequest {
  descripcion: string
}

export interface CrearInstruccionGrupoResponse {
  instruccion: InstruccionGrupo
}

export interface ActualizarInstruccionGrupoRequest {
  descripcion: string
}

export interface ActualizarInstruccionGrupoResponse {
  instruccionActualizada: boolean
}

export interface ConsultarInstruccionesGruposResponse {
  instrucciones: InstruccionGrupo[]
}

export interface EliminarGrupoResponse {
  grupoEliminado: boolean
}
