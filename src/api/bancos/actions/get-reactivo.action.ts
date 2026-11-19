import { isAxiosError } from 'axios'
import { apiClient } from '@/api/http'
import {
  esReactivoSinTraduccion,
  normalizarReactivo,
  type ConsultarReactivoResponse,
  type Reactivo,
} from '../interfaces/reactivo.interface'

/**
 * Consulta un reactivo con el header `Idioma`.
 * Si el backend responde con el placeholder de "sin traducción" devuelve `null`
 * (no es un error: el reactivo simplemente no tiene traducción en ese idioma).
 */
export const getReactivoAction = async (
  idBanco: string,
  idReactivo: string,
  idioma: string,
): Promise<Reactivo | null> => {
  try {
    const { data } = await apiClient.get<ConsultarReactivoResponse>(
      `/bancos/${idBanco}/reactivos/${idReactivo}`,
      { headers: { Idioma: idioma } },
    )
    const reactivo =
      data.reactivos?.find((item) => item.idReactivo === idReactivo) ??
      data.reactivos?.[0] ??
      data.reactivo

    if (!reactivo || esReactivoSinTraduccion(reactivo)) return null

    return normalizarReactivo(reactivo)
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.detail ?? `Error del servidor (${error.response?.status})`,
      )
    }
    throw error instanceof Error ? error : new Error('Error al consultar el reactivo traducido')
  }
}
