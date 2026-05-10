export interface Banco {
  id: number
  nombre: string
  descripcion: string
  fecha: string
  reactivos: string
  estatus?: string
  esCompartido: boolean
  esProyecto: boolean
}
