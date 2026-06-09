import { apiClient } from '@/api/http'
import type { Carpeta, createCarpetasResponse } from '../interfaces/carpeta.interface'
import type { CreateUpdateCarpetaRequest } from '../interfaces'

export const createCarpetaAction = async (
  carpeta: CreateUpdateCarpetaRequest,
): Promise<Carpeta[]> => {
  try {
    console.warn(carpeta.nombre)
    const { data } = await apiClient.post<createCarpetasResponse>('/carpetas', carpeta)

    return data.carpeta
  } catch (error) {
    throw new Error('Error al crear la carpeta')
  }
}
