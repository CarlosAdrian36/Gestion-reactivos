import { apiClient } from '@/api/http'
import type { Banco, CreateBancosResponse } from '../interfaces/banco.interface'
import { isAxiosError } from 'axios'
import type { CreateUpdateBancoRequest } from '../interfaces/create-update-banco.interface'

export const saveBancoAction = async (
  banco: CreateUpdateBancoRequest,
  bancoId?: string,
): Promise<Banco> => {
  try {
    if (bancoId) {
      console.log('Actualizacion')
      const { data } = await apiClient.put<CreateBancosResponse>(`/bancos/${bancoId}`, banco)
      return data.banco
    }
    console.log('Creacion')
    const { data } = await apiClient.post<CreateBancosResponse>('/bancos', banco)
    return data.banco
  } catch (error) {
    if (isAxiosError(error)) {
      console.log(error)
    }
    throw error
  }
}
