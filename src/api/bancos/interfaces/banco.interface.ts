export interface BancoResponse {
  bancos: Banco[]
}

export interface Banco {
  bancoId: number
  nombre: string
  descripcion: string
  esProyecto: boolean
  esCompartido: boolean
  cantidadCompartidos: number
  cantidadReactivos: number
  fechaCreacion: string
  fechaModificacion: string
  propietarioCuentaId?: number
}

export interface CreateBancosResponse {
  banco: Banco
}
