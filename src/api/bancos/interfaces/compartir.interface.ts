export interface CrearCompartidoResponse {
  compartido: CompartidoBaseDTO
}

export interface CompartidoBaseDTO {
  cuentaId: number
  bancoId: number
  fechaCreacion: string
  fechaModificacion: string
  permiso: PermisoDTO
}

export interface CrearPermisoRequest {
  edicion: boolean
}

export interface CrearPermisoResponse {
  permiso: PermisoDTO
}

export interface PermisoDTO {
  lectura: boolean
  edicion: boolean
  fechaCreacion: string
  fechaModificacion: string
}
