export interface NivelCognitivo {
  NivelCognitivoId: number
  Descripcion: string
}

export interface SubTema {
  SubTemaId: number
  Descripcion: string
}

export interface Reactivo {
  IDReactivo: string
  IdiomaId: number
  TipoReactivoId: number
  Version: number
  Descripcion: string
  FechaModificacion: string
  FechaCreacion: string
  NivelCognitivo: NivelCognitivo
  SubTema: SubTema
}
