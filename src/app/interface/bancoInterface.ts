export interface Banco {
  id: number
  nombre: string
  descripcion: string
  fechaModificacion: string
  fechaCreacion?: string
  reactivos: number
  estatus?: string
  esCompartido: boolean
  esProyecto: boolean

  carpetaId: number | null
}
