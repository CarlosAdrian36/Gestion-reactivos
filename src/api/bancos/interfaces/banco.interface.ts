export interface BancoResponse {
  bancos: Banco[]
}

export interface Banco {
  idBanco: string
  nombre: string
  descripcion: string
  esProyecto: boolean
  esCompartido: boolean
  cantidadCompartidos: number
  cantidadReactivos: number
  fechaCreacion: string
  fechaModificacion: string
  propietario: Propietario
  idiomas: Idioma[]
  permiso: Permiso
}

export interface Propietario {
  idCuenta: string
  nombre: string
  apellidoPaterno: string
  apellidoMaterno: string
}

export interface Idioma {
  idiomaId: number
  descripcion: string
}

export interface Permiso {
  fechaCreacion: string
  fechaModificacion: string
  lectura: boolean
  escritura: boolean
}

export interface CreateBancosResponse {
  banco: Banco
}
