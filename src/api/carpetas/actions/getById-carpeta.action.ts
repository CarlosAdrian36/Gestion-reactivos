import { apiClient } from '@/api/http'
import type { Carpeta, createCarpetasResponse } from '../interfaces'

export const getCarpetaById = async (carpetaId: number): Promise<createCarpetasResponse> => {
  const { data } = await apiClient.get<createCarpetasResponse>(`/carpetas/${carpetaId}`)
  return data
}
