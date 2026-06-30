export interface ListaPersonasCompartidas {
  compartidos: Compartido[]
}

export interface Compartido {
  permiso: Permiso
  identidad: Identidad
  bancoId: number
  idCuenta: string
  fechaCreacion: string
  fechaModificacion: string
}

export interface Identidad {
  nombre: string
  apellidoPaterno: string
  apellidoMaterno: string
}

export interface Permiso {
  lectura: boolean
  edicion: boolean
}
