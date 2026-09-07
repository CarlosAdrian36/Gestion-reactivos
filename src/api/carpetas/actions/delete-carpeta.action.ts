import { apiClient } from '@/api/http'
import type { DeleteCarpetaResponse } from '../interfaces'

export const deleteCarpeta = async (carpetaId: string): Promise<DeleteCarpetaResponse> => {
  const { data } = await apiClient.delete<DeleteCarpetaResponse>(`/carpetas/${carpetaId}`)
  return data
}
