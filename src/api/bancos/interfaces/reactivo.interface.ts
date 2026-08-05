export interface Idioma {
  idiomaId: number
  descripcion: string
}

export interface NivelCognitivo {
  nivelCognitivoId: number
  descripcion: string
}

export interface SubTema {
  subTemaId: number
  descripcion: string
}

export interface Reactivo {
  idReactivo: string
  tipoReactivoId: number
  version: number
  descripcion: string
  posicion: number
  fechaCreacion: string
  fechaModificacion: string
  idioma: Idioma
  nivelCognitivo: NivelCognitivo
  subTema: SubTema
}
