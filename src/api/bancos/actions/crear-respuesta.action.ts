import { apiClient } from '@/api/http'
import { isAxiosError } from 'axios'
import type { CrearRespuestaRequest, CrearRespuestaResponse } from '../interfaces/crear-reactivo.interface'

export const crearRespuestaAction = async (
  idBanco: string,
  idReactivo: string,
  body: CrearRespuestaRequest,
): Promise<CrearRespuestaResponse> => {
  try {
    const { data } = await apiClient.post<CrearRespuestaResponse>(
      `/bancos/${idBanco}/reactivos/${idReactivo}/respuestas`,
      body,
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
