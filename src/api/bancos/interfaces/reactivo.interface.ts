import type { Propietario } from './banco.interface'

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
  posicionGrupo: number
  grupo: number
  esCompleto: boolean
  fechaCreacion: string
  fechaModificacion: string
  creadoPor: Propietario
  modificadoPor: Propietario
  idioma: Idioma
  nivelCognitivo: NivelCognitivo
  subTema: SubTema
  hallazgo: boolean
  estado: EstadoReactivo
}

export interface ConsultarReactivoResponse {
  reactivos: Reactivo[]
}

/** En bancos normales puede llegar null o cadena vacía; en proyectos contiene el estado. */
export type EstadoReactivo = string | null

/**
 * Reactivo con los campos extra que agrega el backend en el contexto de proyecto:
 * - `hallazgo`: bandera para saber si el reactivo tiene hallazgos (después se consultan).
 * - `estado`: `'Aceptado' | 'Rechazado'`. En banco normal llega `''`.
 * Comparte la misma respuesta del servicio (`/bancos/:id/reactivos`).
 */
export interface ReactivoProyecto extends Reactivo {
  hallazgo: boolean
  estado: string
}

/** Discriminador: en un banco normal el estado viene vacío, en proyecto trae valor. */
export function esReactivoDeProyecto(r: Reactivo): r is ReactivoProyecto {
  return typeof r.estado === 'string' && r.estado !== ''
}

/** ¿El reactivo de proyecto tiene hallazgos por consultar? */
export function tieneHallazgos(r: Reactivo): boolean {
  return esReactivoDeProyecto(r) && r.hallazgo === true
}

/** Rellena los campos extra también en reactivos de bancos normales. */
export function normalizarReactivo(r: Reactivo): Reactivo {
  return {
    ...r,
    hallazgo: r.hallazgo ?? false,
    estado: r.estado ?? '',
  }
}

/** Normaliza los campos que identifica el contexto de proyecto. */
export function normalizarReactivoProyecto(r: Reactivo): ReactivoProyecto {
  const reactivo = normalizarReactivo(r)

  return {
    ...reactivo,
    estado: reactivo.estado ?? '',
  }
}
