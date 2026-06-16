import { apiClient } from '@/api/http'

export const getBancoCarpetaAction = async (carpetaId: number): Promise<any> => {
  try {
    const { data } = await apiClient.get(`/carpetas/${carpetaId}/Bancos`)
    return data
  } catch (error) {
    console.log(Error)
  }
}
