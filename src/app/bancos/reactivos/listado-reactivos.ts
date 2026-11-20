import type { Reactivo } from '@/api/bancos/interfaces/reactivo.interface'
import type { InstruccionGrupo } from '@/api/bancos/interfaces/instruccion-grupo.interface'
import { stripHtmlToText } from '@/utils/html'

export interface DisplayIndividual {
  tipo: 'individual'
  reactivo: Reactivo
  posicion: number
}

export interface DisplayGrupo {
  tipo: 'grupo'
  grupoId: number
  posicion: number
  instruccion: string
  cantidadReactivos: number
  esCompleto: boolean
  primerReactivo: Reactivo
}

export type DisplayItem = DisplayIndividual | DisplayGrupo

/**
 * Convierte la lista plana de reactivos en el listado para mostrar:
 * los relacionales (tipo 5 con grupo > 0) se agrupan en una sola entrada
 * por grupo, ordenada por la posición del primer miembro.
 */
export function construirItemsListado(
  reactivos: Reactivo[],
  instrucciones: InstruccionGrupo[] = [],
): DisplayItem[] {
  const individuales: DisplayItem[] = []
  const porGrupo = new Map<number, Reactivo[]>()

  for (const r of reactivos) {
    if (r.tipoReactivoId === 5 && r.grupo > 0) {
      const lista = porGrupo.get(r.grupo) ?? []
      lista.push(r)
      porGrupo.set(r.grupo, lista)
    } else {
      individuales.push({ tipo: 'individual', reactivo: r, posicion: r.posicion })
    }
  }

  const grupos: DisplayItem[] = []
  for (const [grupoId, miembros] of porGrupo) {
    miembros.sort((a, b) => a.posicionGrupo - b.posicionGrupo)
    const instruccion = instrucciones.find((i) => i.grupo === grupoId)
    grupos.push({
      tipo: 'grupo',
      grupoId,
      posicion: miembros[0]!.posicion,
      instruccion: stripHtmlToText(instruccion?.descripcion ?? 'Sin instrucción'),
      cantidadReactivos: miembros.length,
      esCompleto: miembros.every((r) => r.esCompleto),
      primerReactivo: miembros[0]!,
    })
  }

  return [...individuales, ...grupos].sort((a, b) => a.posicion - b.posicion)
}
