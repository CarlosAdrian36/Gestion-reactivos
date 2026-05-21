import { apiClient } from '@/api/http'
import type { LoginRequest } from '../interface/loginRequest'
import type { loginSuccess } from '../interface'

export const loginApi = async (loginRequest: LoginRequest): Promise<loginSuccess> => {
  //   console.log('@Intentando iniciar sesión con:', loginRequest)
  console.log('URL de la API:', import.meta.env.VITE_API_URL)
  const { data } = await apiClient.post<loginSuccess>('/sesiones', loginRequest)
  //   console.log('Respuesta del servidor:', data)
  return data
}
