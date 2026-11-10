import { isAxiosError } from 'axios'
import { apiClient } from '@/api/http'
import type {
  CrearTraduccionReactivoRequest,
  CrearTraduccionReactivoResponse,
} from '../interfaces/traduccion.interface'

export const crearTraduccionReactivoAction = async (
  idBanco: string,
  idReactivo: string,
  idioma: string,
  body: CrearTraduccionReactivoRequest,
): Promise<CrearTraduccionReactivoResponse> => {
  try {
    const { data } = await apiClient.post<CrearTraduccionReactivoResponse>(
      `/bancos/${idBanco}/reactivos/${idReactivo}/traducciones`,
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
