import { apiClient } from '@/api/http'
import type { Carpeta, createCarpetasResponse } from '../interfaces/carpeta.interface'
import type { CreateUpdateCarpetaRequest } from '../interfaces'
import { isAxiosError } from 'axios'

export const saveCarpetaAction = async (
  carpeta: CreateUpdateCarpetaRequest,
  carpetaId?: number,
): Promise<Carpeta> => {
  try {
    if (carpetaId) {
      console.log('Actualizo ')
      const { data } = await apiClient.patch<createCarpetasResponse>(
        `/carpetas/${carpetaId}`,
        carpeta,
      )

      return data.carpeta
    }
    console.log('Creoo')
    const { data } = await apiClient.post<createCarpetasResponse>('/carpetas', carpeta)

    return data.carpeta
  } catch (error) {
    if (isAxiosError(error)) {
      // toast.error(error.response?.data.details)
    }
    throw error
  }
}
