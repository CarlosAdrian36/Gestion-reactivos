import { apiClient } from '@/api/http'
import { isAxiosError } from 'axios'
import type { ActualizarPermisoRequest, ActualizarPermisoResponse } from '../interfaces/compartir.interface'

export const actualizarPermisoAction = async (
  bancoId: number,
  guid: string,
  body: ActualizarPermisoRequest,
): Promise<ActualizarPermisoResponse> => {
  try {
    const { data } = await apiClient.put<ActualizarPermisoResponse>(
      `/bancos/${bancoId}/compartidos/${guid}/permisos`,
      body,
    )
    return data
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.detail ?? `Error del servidor (${error.response?.status})`)
    }
    throw new Error('Error al conectar con el servidor')
  }
}
