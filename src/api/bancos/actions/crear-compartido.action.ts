import { apiClient } from '@/api/http'
import { isAxiosError } from 'axios'
import type { CrearCompartidoResponse } from '../interfaces/compartir.interface'

export const crearCompartidoAction = async (
  bancoId: number,
  guid: string,
): Promise<CrearCompartidoResponse> => {
  try {
    const { data } = await apiClient.post<CrearCompartidoResponse>(
      `/bancos/${bancoId}/compartidos/${guid}`,
    )
    return data
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.detail ?? `Error del servidor (${error.response?.status})`)
    }
    throw new Error('Error al conectar con el servidor')
  }
}
