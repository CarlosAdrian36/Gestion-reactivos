import { apiClient } from '@/api/http'
import type { Carpeta, createCarpetasResponse } from '../interfaces/carpeta.interface'
import type { CreateUpdateCarpetaRequest } from '../interfaces'
import { isAxiosError } from 'axios'
import { toast } from 'vue-sonner'

export const createCarpetaAction = async (
  carpeta: CreateUpdateCarpetaRequest,
): Promise<Carpeta[]> => {
  try {
    console.warn(carpeta.nombre)
    const { data } = await apiClient.post<createCarpetasResponse>('/carpetas', carpeta)

    return data.carpeta
  } catch (error) {
    if (isAxiosError(error)) {
      console.log('Status', error.response?.status)
      console.log('data', error.response?.data.detail)
      toast.error(error.response?.data.detail)
    }
    throw error
  }
}
