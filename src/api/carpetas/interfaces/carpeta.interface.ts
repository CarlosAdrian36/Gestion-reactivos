export interface Carpeta {
  carpetaId: number
  nombre: string
  cantidadBancos: number
  fechaCreacion: string
  fechaModificacion: string
}
export interface getCarpetasResponse {
  carpetas: Carpeta[]
}
export interface createCarpetasResponse {
  carpeta: Carpeta
}
