import { apiClient } from '@/api/http'
import type { Carpeta, CarpetasResponse } from '../interfaces/carpeta.interface'

export const getCarpetasAction = async (): Promise<Carpeta[]> => {
  try {
    const { data } = await apiClient.get<CarpetasResponse>('/carpetas')
    // console.log('Estas son las carpetas', data)
    return data.carpetas
  } catch (error) {
    throw new Error('Error al obtener las carpetas')
  }
}
