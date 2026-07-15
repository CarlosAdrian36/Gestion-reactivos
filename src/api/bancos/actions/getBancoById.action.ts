import { apiClient } from '@/api/http'
import type { Banco } from '../interfaces/banco.interface'

export const getBancoById = async (idBanco: string): Promise<Banco> => {
  try {
    const { data } = await apiClient.get<{ banco: Banco }>(`/bancos/${idBanco}`)
    console.log(data)
    return data.banco
  } catch (error) {
    throw error
  }
}
