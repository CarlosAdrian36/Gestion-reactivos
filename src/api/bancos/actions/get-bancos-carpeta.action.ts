import { apiClient } from '@/api/http'
import type { Banco, BancoResponse } from '../interfaces/banco.interface'

export const getBancoCarpetaAction = async (carpetaId: number): Promise<Banco[]> => {
  try {
    const { data } = await apiClient.get<BancoResponse>(`/carpetas/${carpetaId}/Bancos`)
    return data.bancos
  } catch (error) {
    console.log(error)
    throw error
  }
}
