import { apiClient } from '@/api/http'
import type { CreateBancosResponse } from '../interfaces/banco.interface'

export const getBancoById = async (bancoId: string): Promise<CreateBancosResponse> => {
  try {
    const { data } = await apiClient.get<CreateBancosResponse>(`/bancos/${bancoId}`)
    console.log(data)
    return data
  } catch (error) {
    throw error
  }
}
