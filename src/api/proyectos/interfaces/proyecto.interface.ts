import type { Propietario } from '@/api/bancos/interfaces/banco.interface'

export interface Estado {
  estadoId: number
  nombre: string
}

export interface Funcion {
  funcionId: number
  nombre: string
}

export interface Fase {
  nombre: string
  funcion: string | null
  estado: string
}

export interface Hallazgo {
  idHallazgo: string
  titulo: string
  descripcion: string
  estado: string
  prioridad: string
  autor?: Propietario
  fechaCreacion: string
}

export interface IdiomaProyecto {
  etiqueta: string
  descripcion: string
}

export interface BancoProyecto {
  idProyecto: string
  tipoElementoId: number
  notificaciones: boolean
  fechaEntrega: string | null
  estado: Estado
  fases: Fase[]
  funciones: Funcion[]
  nombre: string
  descripcion: string
  fechaCreacion: string
  fechaModificacion: string
  propietario: Propietario
  idiomas: IdiomaProyecto[]
}

export interface ProyectosResponse {
  proyectos: BancoProyecto[]
}
