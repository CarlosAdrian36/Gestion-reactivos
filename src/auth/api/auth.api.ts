import { apiClient } from '@/api/http'

export const logoutApi = async (): Promise<boolean> => {
  const { data } = await apiClient.delete('/sesion')
  return data
}
