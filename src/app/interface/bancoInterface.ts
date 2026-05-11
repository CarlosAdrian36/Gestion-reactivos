export interface Banco {
  id: number
  nombre: string
  descripcion: string
  fecha: string
  reactivos: number
  estatus?: string
  esCompartido: boolean
  esProyecto: boolean

  carpetaId: number | null
}
