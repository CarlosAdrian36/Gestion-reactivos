import { isAxiosError } from 'axios'
import { apiClient } from '@/api/http'
import {
  normalizarReactivo,
  type ConsultarReactivoResponse,
  type Reactivo,
} from '../interfaces/reactivo.interface'

export const getReactivoAction = async (
  idBanco: string,
  idReactivo: string,
  idioma: string,
): Promise<Reactivo> => {
  try {
    const { data } = await apiClient.get<ConsultarReactivoResponse>(
      `/bancos/${idBanco}/reactivos/${idReactivo}`,
      { headers: { Idioma: idioma } },
    )
    const reactivo =
      data.reactivos?.find((item) => item.idReactivo === idReactivo) ?? data.reactivos?.[0]

    if (!reactivo) throw new Error('No se encontró el reactivo en el idioma solicitado')

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
