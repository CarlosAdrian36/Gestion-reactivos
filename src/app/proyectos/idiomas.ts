import banderaMx from '@/assets/banderas/mx.png'
import banderaUs from '@/assets/banderas/us.png'
import banderaFr from '@/assets/banderas/fr.png'

/** Etiqueta normalizada del idioma original (español MX). */
export const IDIOMA_ORIGINAL = 'es_mx'

/** Normaliza una etiqueta de idioma: sin espacios y con guion bajo. */
export function normalizarEtiquetaIdioma(etiqueta: string): string {
  return etiqueta.trim().toLowerCase().replace('-', '_')
}

/** Bandera por etiqueta de idioma (las mismas imágenes del listado de proyectos). */
export const BANDERAS_IDIOMA: Record<string, string> = {
  es_MX: banderaMx,
  en_US: banderaUs,
  fr_FR: banderaFr,
}

/** Bandera de un idioma por etiqueta; cadena vacía si no hay imagen para él. */
export function banderaIdioma(etiqueta: string): string {
  return BANDERAS_IDIOMA[etiqueta] ?? BANDERAS_IDIOMA[normalizarEtiquetaIdioma(etiqueta)] ?? ''
}
