import { apiClient } from '@/api/http'
import { isAxiosError } from 'axios'
import type { InstruccionGrupo } from '../interfaces/instruccion-grupo.interface'

export const getInstruccionesGruposAction = async (
  idBanco: string,
): Promise<InstruccionGrupo[]> => {
  try {
    const { data } = await apiClient.get<{ instrucciones: InstruccionGrupo[] }>(
      `/bancos/${idBanco}/reactivos/grupos/instrucciones`,
    )
    return data.instrucciones
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.detail ?? `Error del servidor (${error.response?.status})`,
      )
    }
    throw new Error('Error al conectar con el servidor')
  }
}
