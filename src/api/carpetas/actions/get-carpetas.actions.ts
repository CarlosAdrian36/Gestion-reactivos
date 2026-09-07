import { apiClient } from '@/api/http'
import type { Carpeta, getCarpetasResponse } from '../interfaces/carpeta.interface'

export const getCarpetasAction = async (): Promise<Carpeta[]> => {
  try {
    const { data } = await apiClient.get<getCarpetasResponse>('/carpetas')
    return data.carpetas
  } catch {
    throw new Error('Error al obtener las carpetas')
  }
}
