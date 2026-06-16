export interface BancoResponse {
  bancos: Banco[]
}

export interface Banco {
  esProyecto: boolean
  esCompartido: boolean
  cantidadCompartidos: number
  cantidadReactivos: number
  fechaCreacion: string
  fechaModificacion: string
  bancoId: number
  // propietarioCuentaId: number
  nombre: string
  descripcion: string
}

export interface CreateBancosResponse {
  banco: Banco
}
