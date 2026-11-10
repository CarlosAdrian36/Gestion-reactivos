import { isAxiosError } from 'axios'
import { apiClient } from '@/api/http'
import type {
  CrearTraduccionRespuestaRequest,
  CrearTraduccionRespuestaResponse,
} from '../interfaces/traduccion.interface'

export const crearTraduccionRespuestaAction = async (
  idBanco: string,
  idReactivo: string,
  idRespuesta: string,
  idioma: string,
  body: CrearTraduccionRespuestaRequest,
): Promise<CrearTraduccionRespuestaResponse> => {
  try {
    const { data } = await apiClient.post<CrearTraduccionRespuestaResponse>(
      `/bancos/${idBanco}/reactivos/${idReactivo}/respuestas/${idRespuesta}`,
      body,
      { headers: { Idioma: idioma } },
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
