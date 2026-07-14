import type { Propietario } from '@/api/bancos/interfaces/banco.interface'

export interface Carpeta {
  idCarpeta: string
  nombre: string
  cantidadBancos: number
  fechaCreacion: string
  fechaModificacion: string
  propietario: Propietario
}
export interface getCarpetasResponse {
  carpetas: Carpeta[]
}
export interface createCarpetasResponse {
  carpeta: Carpeta
}
