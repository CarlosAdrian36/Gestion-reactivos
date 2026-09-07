import { apiClient } from '@/api/http'

export const deleteBanco = async (bancoId: string): Promise<void> => {
  await apiClient.delete(`/bancos/${bancoId}`)
}
