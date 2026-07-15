import { apiClient } from '@/api/http'
import type { Banco, BancoResponse } from '../interfaces/banco.interface'

export const getBancoCarpetaAction = async (IdCarpeta: string): Promise<Banco[]> => {
  try {
    const { data } = await apiClient.get<BancoResponse>(`/carpetas/${IdCarpeta}/Bancos`)
    return data.bancos
  } catch (error) {
    console.log(error)
    throw error
  }
}
