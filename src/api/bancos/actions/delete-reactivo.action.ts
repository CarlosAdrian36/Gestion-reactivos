import { apiClient } from '@/api/http'
import { isAxiosError } from 'axios'

export const deleteReactivoAction = async (
  bancoId: string,
  idReactivo: string,
  idGrupo?: number | null,
): Promise<{ reactivoEliminado: boolean }> => {
  try {
    const config =
      idGrupo != null && idGrupo > 0 ? { data: { idGrupo } } : undefined
    const { data } = await apiClient.delete<{ reactivoEliminado: boolean }>(
      `/bancos/${bancoId}/reactivos/${idReactivo}`,
      config,
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
