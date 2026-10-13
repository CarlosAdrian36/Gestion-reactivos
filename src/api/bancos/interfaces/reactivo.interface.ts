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
  idioma: Idioma
  nivelCognitivo: NivelCognitivo
  subTema: SubTema
  /**
   * Solo los llena el backend cuando el id corresponde a un proyecto.
   * En banco normal llegan `undefined` (o `false` / `''` según el backend).
   */
  hallazgos?: boolean
  estado?: EstadoReactivo
}

/**
 * Estado de un reactivo dentro de un proyecto.
 * En bancos normales el backend envía `''` (indica que no pertenece a un proyecto).
 */
export type EstadoReactivo = 'Aceptado' | 'Rechazado' | ''

/**
 * Reactivo con los campos extra que agrega el backend en el contexto de proyecto:
 * - `hallazgos`: bandera para saber si el reactivo tiene hallazgos (después se consultan).
 * - `estado`: `'Aceptado' | 'Rechazado'`. En banco normal llega `''`.
 * Comparte la misma respuesta del servicio (`/bancos/:id/reactivos`).
 */
export interface ReactivoProyecto extends Reactivo {
  hallazgos: boolean
  estado: EstadoReactivo
}

/** Discriminador: en un banco normal el estado viene vacío, en proyecto trae valor. */
export function esReactivoDeProyecto(r: Reactivo): r is ReactivoProyecto {
  return typeof r.estado === 'string' && r.estado !== ''
}

/** ¿El reactivo de proyecto tiene hallazgos por consultar? */
export function tieneHallazgos(r: Reactivo): boolean {
  return esReactivoDeProyecto(r) && r.hallazgos === true
}

/** Rellena los valores por defecto por si el backend no envía las propiedades. */
export function normalizarReactivo(r: Reactivo): ReactivoProyecto {
  return {
    ...r,
    hallazgos: r.hallazgos ?? false,
    estado: r.estado ?? '',
  }
}
