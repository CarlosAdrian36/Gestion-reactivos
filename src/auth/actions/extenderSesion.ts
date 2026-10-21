import { apiClient } from '@/api/http'
import type { LoginSuccessB } from '../interface'

export const extenderSesionAction = async () => {
  const { data } = await apiClient.post<LoginSuccessB>('/sesion/refresh')
  return data
}
