import { apiClient } from '@/api/http'
import { isAxiosError } from 'axios'

export const deleteReactivoAction = async (
  bancoId: string,
  idReactivo: string,
  idGrupo?: number | null,
): Promise<{ reactivoEliminado: boolean }> => {
  try {
    const { data } = await apiClient.delete<{ reactivoEliminado: boolean }>(
      `/bancos/${bancoId}/reactivos/${idReactivo}`,
      { data: { idGrupo: idGrupo ?? 0 } },
    )
    return data
  } catch (error) {
    if (isAxiosError(error)) {
      console.log(error)
      throw new Error(
        error.response?.data?.detail ?? `Error del servidor (${error.response?.status})`,
      )
    }
    throw new Error('Error al conectar con el servidor')
  }
}
