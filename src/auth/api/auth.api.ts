import { apiClient } from '@/api/http'
import type { LoginRequest } from '../interface/loginRequest'
import type { LoginSuccess } from '../interface'

export const loginApi = async (loginRequest: LoginRequest): Promise<LoginSuccess> => {
  console.log('aqui paso')
  console.log('URL de la API:', import.meta.env.VITE_API_URL)
  const { data } = await apiClient.post<LoginSuccess>('/sesion', loginRequest)
  return data
}

export const logoutApi = async (): Promise<boolean> => {
  const { data } = await apiClient.delete('/sesion')
  return data
}
