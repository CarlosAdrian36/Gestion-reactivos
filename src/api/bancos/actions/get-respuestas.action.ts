import { apiClient } from '@/api/http'
import { isAxiosError } from 'axios'
import type { Respuesta } from '../interfaces/respuesta.interface'

export const getRespuestasAction = async (
  idBanco: string,
  idReactivo: string,
  idioma?: string,
): Promise<Respuesta[]> => {
  try {
    const { data } = await apiClient.get<{ respuestas: Respuesta[] }>(
      `/bancos/${idBanco}/reactivos/${idReactivo}/respuestas`,
      idioma ? { headers: { Idioma: idioma } } : undefined,
    )
    return data.respuestas
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.detail ?? `Error del servidor (${error.response?.status})`,
      )
    }
    throw new Error('Error al conectar con el servidor')
  }
}
