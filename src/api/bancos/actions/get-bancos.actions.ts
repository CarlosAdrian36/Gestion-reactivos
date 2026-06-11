import { apiClient } from '@/api/http'
import type { Banco, BancoResponse } from '../interfaces/banco.interface'

export const getBancosAction = async (): Promise<Banco[]> => {
  try {
    const { data } = await apiClient.get<BancoResponse>('/bancos')
    // console.log('Estos son los bancos', data)
    return data.bancos
  } catch (error) {
    console.log(error)
    throw new Error('Error al obtener los bancos')
  }
}
