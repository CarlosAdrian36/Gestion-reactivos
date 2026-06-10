import { apiClient } from '@/api/http'
import type { DeleteCarpetaResponse } from '../interfaces'

export const deleteCarpeta = async (carpetaId: number): Promise<DeleteCarpetaResponse> => {
  try {
    const { data } = await apiClient.delete<DeleteCarpetaResponse>(`/carpetas/${carpetaId}`)
    return data
  } catch (error) {
    throw error
  }
}
