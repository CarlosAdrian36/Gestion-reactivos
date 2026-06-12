import { apiClient } from '@/api/http'

export const deleteBanco = async (bancoId: number): Promise<any> => {
  try {
    const { data } = await apiClient.delete(`/bancos/${bancoId}`)
    return
  } catch (error) {
    throw error
  }
}
