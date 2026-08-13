import { apiClient } from '@/api/http'
import { isAxiosError } from 'axios'

export const actualizarRespuestaAction = async (
  bancoId: string,
  idReactivo: string,
  idRespuesta: string,
  body: { esCorrecta: boolean; respuesta: string },
): Promise<{ respuestaActualizada: boolean }> => {
  try {
    const { data } = await apiClient.put<{ respuestaActualizada: boolean }>(
      `/bancos/${bancoId}/reactivos/${idReactivo}/respuestas/${idRespuesta}`,
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
