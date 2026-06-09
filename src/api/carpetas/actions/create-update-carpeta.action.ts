import { apiClient } from '@/api/http'
import type { Carpeta, createCarpetasResponse } from '../interfaces/carpeta.interface'
import type { CreateUpdateCarpetaRequest } from '../interfaces'
import { isAxiosError } from 'axios'
import { toast } from 'vue-sonner'

// export const createCarpetaAction = async (
//   carpeta: CreateUpdateCarpetaRequest,
// ): Promise<Carpeta[]> => {
//   try {
//     console.warn(carpeta.nombre)
//     const { data } = await apiClient.post<createCarpetasResponse>('/carpetas', carpeta)

//     return data.carpeta
//   } catch (error) {
//     if (isAxiosError(error)) {
//       console.log('Status', error.response?.status)
//       console.log('data', error.response?.data.detail)
//       // toast.error(error.response?.data.detail)
//     }
//     throw error
//   }
// }

// export const updateCarpetaAction = async (
//   carpetaId: number,
//   carpeta: CreateUpdateCarpetaRequest,
// ): Promise<Carpeta[]> => {
//   try {
//     const { data } = await apiClient.patch<createCarpetasResponse>(
//       `/carpetas/${carpetaId}`,
//       carpeta,
//     )
//     return data.carpeta
//   } catch (error) {
//     if (isAxiosError(error)) {
//       toast.error(error.response?.data.detail)
//     }
//     throw error
//   }
// }

export const saveCarpetaAction = async (
  carpeta: CreateUpdateCarpetaRequest,
  carpetaId?: number,
): Promise<Carpeta> => {
  try {
    if (carpetaId) {
      const { data } = await apiClient.patch<createCarpetasResponse>(
        `/carpetas/${carpetaId}`,
        carpeta,
      )

      return data.carpeta
    }

    const { data } = await apiClient.post<createCarpetasResponse>('/carpetas', carpeta)

    return data.carpeta
  } catch (error) {
    if (isAxiosError(error)) {
      // toast.error(error.response?.data.details)
    }
    throw error
  }
}
