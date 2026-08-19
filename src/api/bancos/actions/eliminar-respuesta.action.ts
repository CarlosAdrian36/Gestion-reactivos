import { apiClient } from '@/api/http'
import { isAxiosError } from 'axios'

export const eliminarRespuestaAction = async (
  bancoId: string,
  idReactivo: string,
  idRespuesta: string,
): Promise<{ respuestaEliminada: boolean }> => {
  try {
    const { data } = await apiClient.delete<{ respuestaEliminada: boolean }>(
      `/bancos/${bancoId}/reactivos/${idReactivo}/respuestas/${idRespuesta}`,
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
