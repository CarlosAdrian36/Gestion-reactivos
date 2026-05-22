import { apiClient } from '@/api/http'
import type { LoginRequest } from '../interface/loginRequest'
import type { loginSuccess } from '../interface'

export const loginApi = async (loginRequest: LoginRequest): Promise<loginSuccess> => {
  console.log('URL de la API:', import.meta.env.VITE_API_URL)
  const { data } = await apiClient.post<loginSuccess>('/sesiones', loginRequest)
  return data
}
