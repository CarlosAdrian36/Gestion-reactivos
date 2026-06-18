import { apiClient } from '@/api/http'
import type { MoveBancoResponse } from '../interfaces/banco-move.interface'

export const moveBancoCarpeta = async (
  carpetaId: number,
  bancoId: number,
): Promise<MoveBancoResponse> => {
  const { data } = await apiClient.post<MoveBancoResponse>(
    `/carpetas/${carpetaId}/bancos/${bancoId}`,
  )

  return data
}
