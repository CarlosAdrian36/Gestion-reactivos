import type { Idioma, Propietario } from '@/api/bancos/interfaces/banco.interface'

export interface Estado {
  idEstado: number
  nombre: 'Pendiente' | 'En proceso' | 'Completada'
}

export interface Fase {
  nombre: 'Construccion' | 'Revision' | 'Traduccion' | 'Revision traduccion' | 'Finalizado'
  estado: 'Pendiente' | 'En proceso' | 'Completada'
  funcion: 'Elaborador' | 'Revisor' | 'Traductor' | 'Revisor de traduccion' | null
}

export interface BancoProyecto {
  idBanco: string
  nombre: string
  descripcion: string
  cantidadReactivos: number
  fechaCreacion: string
  fechaModificacion: string
  propietario: Propietario
  idiomas: Idioma[]
  esProyecto: boolean
  fechaEntrega: string
  tipoElementoId: 2
  estado: Estado
  funciones: string[]
  fases: Fase[]
  notificaciones: boolean
}

export interface ProyectosResponse {
  proyectos: BancoProyecto[]
}
