export interface Carpeta {
  carpetaId: number
  nombre: string
  cantidadBancos: number
  fechaCreacion: string
  fechaModificacion: string
}
export interface CarpetasResponse {
  carpetas: Carpeta[]
}
