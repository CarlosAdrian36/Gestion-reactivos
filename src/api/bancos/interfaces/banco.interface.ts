// export interface Banco {
//   esProyecto: boolean
//   fechaCreacion: Date
//   fechaModificacion: Date
//   bancoId: number
//   nombre: string
//   descripcion: string
//   esCompartido: boolean
// }
export interface BancoResponse {
  bancos: Banco[]
}

export interface Banco {
  esProyecto: boolean
  esCompartido: boolean
  cantidadCompartidos: number
  cantidadReactivos: number
  fechaCreacion: Date
  fechaModificacion: Date
  bancoId: number
  propietarioCuentaId: number
  nombre: string
  descripcion: string
}
