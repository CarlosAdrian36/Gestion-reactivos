import { apiClient } from '@/api/http'
import type { LoginRequest } from '../interface/loginRequest'
import type { loginSuccess } from '../interface'

export const loginApi = async (loginRequest: LoginRequest): Promise<loginSuccess> => {
  console.log('aqui paso')
  console.log('URL de la API:', import.meta.env.VITE_API_URL)
  const { data } = await apiClient.post<loginSuccess>('/sesion', loginRequest)
  return data
}

export const logoutApi = async (): Promise<boolean> => {
  const { data } = await apiClient.delete('/sesion')
  return data
}
