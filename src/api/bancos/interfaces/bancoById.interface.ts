export interface BancoByID {
  banco: Banco
}

export interface Banco {
  esPropitario: boolean
  idCuenta: string
  identidad: Identidad
  bancoId: number
  nombre: string
  descripcion: string
  esProyecto: boolean
  esCompartido: boolean
  cantidadCompartidos: number
  cantidadReactivos: number
  fechaCreacion: Date
  fechaModificacion: Date
}

export interface Identidad {
  nombre: string
  apellidoPaterno: string
  apellidoMaterno: string
}
