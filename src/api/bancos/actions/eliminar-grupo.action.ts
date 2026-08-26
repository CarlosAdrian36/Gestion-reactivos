import { apiClient } from '@/api/http'
import { isAxiosError } from 'axios'
import type { EliminarGrupoResponse } from '../interfaces/instruccion-grupo.interface'

export const eliminarGrupoAction = async (
  idBanco: string,
  idGrupo: number,
): Promise<EliminarGrupoResponse> => {
  try {
    const { data } = await apiClient.delete<EliminarGrupoResponse>(
      `/bancos/${idBanco}/reactivos/grupos/${idGrupo}`,
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
