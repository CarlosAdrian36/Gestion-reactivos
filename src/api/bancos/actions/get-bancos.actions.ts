import { apiClient } from '@/api/http'
import type { Banco } from '@/app/interface'

export const getBancosAction = async () => {
  try {
    const { data } = await apiClient.get<Banco[]>('/bancos')
    console.log('Estos son los bancos', data)
    return data
  } catch (error) {
    throw new Error('Error al obtener los bancos')
  }
}
