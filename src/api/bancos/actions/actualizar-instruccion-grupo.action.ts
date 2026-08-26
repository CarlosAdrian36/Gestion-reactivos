import { apiClient } from '@/api/http'
import { isAxiosError } from 'axios'
import type {
  ActualizarInstruccionGrupoRequest,
  ActualizarInstruccionGrupoResponse,
} from '../interfaces/instruccion-grupo.interface'

export const actualizarInstruccionGrupoAction = async (
  idBanco: string,
  idGrupo: number,
  body: ActualizarInstruccionGrupoRequest,
): Promise<ActualizarInstruccionGrupoResponse> => {
  try {
    const { data } = await apiClient.put<ActualizarInstruccionGrupoResponse>(
      `/bancos/${idBanco}/reactivos/grupos/${idGrupo}/instrucciones`,
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
