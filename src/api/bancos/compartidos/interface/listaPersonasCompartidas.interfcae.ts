export interface ListaPersonasCompartidas {
  compartidos: Compartido[]
}

export interface Compartido {
  idBanco: string
  idCuenta: string
  fechaCreacion: string
  fechaModificacion: string
  permiso: Permiso
  nombre: string
  apellidoPaterno: string
  apellidoMaterno: string
}

export interface Permiso {
  lectura: boolean
  edicion: boolean
}
