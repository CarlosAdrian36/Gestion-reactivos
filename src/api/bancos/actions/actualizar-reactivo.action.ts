import { apiClient } from '@/api/http'
import { isAxiosError } from 'axios'

export const actualizarReactivoAction = async (
  bancoId: string,
  idReactivo: string,
  body: { tipoReactivoId: number; descripcion: string },
  idioma?: string,
): Promise<{ reactivoActualizado: boolean }> => {
  try {
    const { data } = await apiClient.put<{ reactivoActualizado: boolean }>(
      `/bancos/${bancoId}/reactivos/${idReactivo}`,
      body,
      idioma ? { headers: { Idioma: idioma } } : undefined,
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
