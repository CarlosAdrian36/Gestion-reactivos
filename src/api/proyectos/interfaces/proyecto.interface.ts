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
  hallazgoId: string | number
  idProyecto: string
  idReactivo: string
  nombre: string
  descripcion: string
  fechaCreacion: string
  fechaModificacion: string
  propietario: {
    idCuenta: string
    nombre: string
    apellidoPaterno: string
    apellidoMaterno: string
  }
  funcion: Funcion
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

export interface ProyectoDetalle extends BancoProyecto {
  cantidadReactivos: number
  hallazgos: boolean
}

export interface ProyectoDetalleResponse {
  proyecto: ProyectoDetalle
}

export interface ProyectosResponse {
  proyectos: BancoProyecto[]
}

export interface UpdateProyectoRequest {
  nombre: string
  descripcion: string
  idiomas?: string[] | null
  notificaciones?: boolean | null
  fechaEntrega?: string | null
}

export interface UpdateProyectoResponse {
  proyectos: BancoProyecto
}

export interface Integrante {
  idProyecto: string
  idCuenta: string
  nombre: string
  apellidoPaterno: string
  apellidoMaterno: string
  fechaCreacion: string
  fechaModificacion: string
  funciones: Funcion[]
}

export interface ConsultarIntegrantesResponse {
  integrantes: Integrante[]
}

export interface ConsultarFuncionesResponse {
  funciones: Funcion[]
}

export interface AsignarFuncionRequest {
  funcionId: number | string
}

export interface AsignarFuncionResponse {
  funcionAsignada: boolean
}

export interface ActualizarFuncionMiembroRequest {
  funcionesId: number[]
}

export interface ActualizarFuncionMiembroResponse {
  funcionActualizada: boolean
}

export interface EliminarMiembroResponse {
  miembroEliminado: boolean
}
