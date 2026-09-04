import { apiClient } from '@/api/http'
import type { LoginRequest } from '../interface/loginRequest'
import type { LoginSuccess } from '../interface'

export const loginApi = async (loginRequest: LoginRequest): Promise<LoginSuccess> => {
  const { data } = await apiClient.post<LoginSuccess>('/sesion', loginRequest)
  return data
}

export const logoutApi = async (): Promise<boolean> => {
  const { data } = await apiClient.delete('/sesion')
  return data
}
