export interface CompartidoBaseDTO {
  cuentaId: number
  bancoId: number
  fechaCreacion: string
  fechaModificacion: string
  permiso: PermisoDTO
}

export interface CrearCompartidoRequest {
  permitirEdicion: boolean
}

export interface CrearCompartidoResponse {
  compartido: CompartidoBaseDTO
}

export interface CrearPermisoRequest {
  edicion: boolean
}

export interface CrearPermisoResponse {
  permiso: PermisoDTO
}

export interface ActualizarPermisoRequest {
  compartidoId: number
  edicion: boolean
}

export interface ActualizarPermisoResponse {
  permiso: PermisoDTO
}

export interface PermisoDTO {
  lectura: boolean
  edicion: boolean
  fechaCreacion: string
  fechaModificacion: string
}
