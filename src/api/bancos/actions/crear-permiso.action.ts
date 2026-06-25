import { apiClient } from '@/api/http'
import { isAxiosError } from 'axios'
import type { CrearPermisoRequest, CrearPermisoResponse } from '../interfaces/compartir.interface'

export const crearPermisoAction = async (
  bancoId: number,
  cuentaId: number,
  body: CrearPermisoRequest,
): Promise<CrearPermisoResponse> => {
  try {
    const { data } = await apiClient.post<CrearPermisoResponse>(
      `/bancos/${bancoId}/compartidos/${cuentaId}/permisos`,
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
