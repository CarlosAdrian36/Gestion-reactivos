import { apiClient } from '@/api/http'
import { isAxiosError } from 'axios'
import type { TipoReactivoDTO } from '../interfaces/tipo-reactivo.interface'

export const getTiposReactivoAction = async (): Promise<TipoReactivoDTO[]> => {
  try {
    const { data } = await apiClient.get<{ tiposReactivos: TipoReactivoDTO[] }>('/tipos')
    return data.tiposReactivos
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.detail ?? `Error del servidor (${error.response?.status})`,
      )
    }
    throw new Error('Error al conectar con el servidor')
  }
}
