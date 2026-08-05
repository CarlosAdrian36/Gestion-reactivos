import { apiClient } from '@/api/http'
import { isAxiosError } from 'axios'
import type { CrearReactivoRequest, CrearReactivoResponse } from '../interfaces/crear-reactivo.interface'

export const crearReactivoAction = async (
  idBanco: string,
  body: CrearReactivoRequest,
): Promise<CrearReactivoResponse> => {
  try {
    const { data } = await apiClient.post<CrearReactivoResponse>(`/bancos/${idBanco}/reactivos`, body)
    return data
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.detail ?? `Error del servidor (${error.response?.status})`,
      )
    }
    throw new Error('Error al conectar con el servidor')
  }
}
