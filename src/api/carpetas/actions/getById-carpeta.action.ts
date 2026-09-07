import { apiClient } from '@/api/http'
import type { createCarpetasResponse } from '../interfaces'

export const getCarpetaById = async (IdCarpeta: string): Promise<createCarpetasResponse> => {
  const { data } = await apiClient.get<createCarpetasResponse>(`/carpetas/${IdCarpeta}`)
  return data
}
