import { apiClient } from '@/api/http'
import { isAxiosError } from 'axios'
import type { CrearReactivoRequest, CrearReactivoResponse } from '../interfaces/crear-reactivo.interface'

export const crearReactivoAction = async (
  idBanco: string,
  body: CrearReactivoRequest,
): Promise<CrearReactivoResponse> => {
  try {
    const payload = { ...body }
    if (payload.idGrupo != null && payload.idGrupo > 0) {
      payload.idGrupo = payload.idGrupo
    } else {
      delete payload.idGrupo
    }
    const { data } = await apiClient.post<CrearReactivoResponse>(
      `/bancos/${idBanco}/reactivos`,
      payload,
    )
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
