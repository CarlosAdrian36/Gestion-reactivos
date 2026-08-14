export type TipoReactivoSlug =
  | 'opcion-multiple'
  | 'respuesta-multiple'
  | 'verdadero-falso'
  | 'pregunta-abierta'
  | 'relacional'

export interface TipoReactivoDTO {
  tipoReactivoId: number
  nombre: string
}

export interface TipoReactivoInfo extends TipoReactivoDTO {
  id: TipoReactivoSlug
  descripcion: string
  icono: string
}
