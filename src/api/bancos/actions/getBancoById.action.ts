import { apiClient } from '@/api/http'
import type { BancoByID } from '../interfaces/bancoById.interface'

export const getBancoById = async (bancoId: string): Promise<BancoByID> => {
  try {
    const { data } = await apiClient.get<BancoByID>(`/bancos/${bancoId}`)
    console.log(data)
    return data
  } catch (error) {
    throw error
  }
}
