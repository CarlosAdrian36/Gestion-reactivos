import { apiClient } from '@/api/http'
import { isAxiosError } from 'axios'
import type {
  CrearInstruccionGrupoRequest,
  CrearInstruccionGrupoResponse,
} from '../interfaces/instruccion-grupo.interface'

export const crearInstruccionGrupoAction = async (
  idBanco: string,
  body: CrearInstruccionGrupoRequest,
): Promise<CrearInstruccionGrupoResponse> => {
  try {
    const { data } = await apiClient.post<CrearInstruccionGrupoResponse>(
      `/bancos/${idBanco}/reactivos/grupos/instrucciones`,
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
