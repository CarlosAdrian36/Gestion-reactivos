import { apiClient } from '@/api/http'
import type { Banco, createBancosResponse } from '../interfaces/banco.interface'
import { isAxiosError } from 'axios'
import type { CreateUpdateCarpetaRequest } from '@/api/carpetas/interfaces'

export const saveBancoAction = async (
  banco: CreateUpdateCarpetaRequest,
  BancoId?: number,
): Promise<Banco> => {
  try {
    if (BancoId) {
      console.log('Actualizacion')
      const { data } = await apiClient.patch<createBancosResponse>(`/bancos/${BancoId}`, banco)
      return data.bancos
    }
    console.log('Creacion')
    const { data } = await apiClient.post<createBancosResponse>('/bancos', banco)
    return data.bancos
  } catch (error) {
    if (isAxiosError(error)) {
      console.log(error)
    }
    throw error
  }
}
