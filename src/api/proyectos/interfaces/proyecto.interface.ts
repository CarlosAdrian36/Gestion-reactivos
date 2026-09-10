import type { Idioma, Propietario } from '@/api/bancos/interfaces/banco.interface'

export interface Estado {
  idEstado: number
  nombre: 'Pendiente' | 'En proceso' | 'Completada'
}

export interface Fase {
  idFase: number
  nombre: 'Construccion' | 'Revision' | 'Traduccion' | 'Revision traduccion' | 'Finalizado'
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
  tipoElementoId: number
  estado: Estado
  fase: Fase
  notificaciones: number
}

export interface ProyectosResponse {
  proyectos: BancoProyecto[]
}
