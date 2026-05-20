import { apiClient } from '@/api/http'
import type { LoginResponse } from '../interface/loginResponse'
import type { LoginRequest } from '../interface/loginRequest'

export const loginApi = async (loginRequest: LoginRequest): Promise<LoginResponse> => {
  //   console.log('@Intentando iniciar sesión con:', loginRequest)
  console.log('URL de la API:', import.meta.env.VITE_API_URL)
  const { data } = await apiClient.post<LoginResponse>('/roles', loginRequest)
  //   console.log('Respuesta del servidor:', data)
  return data
}
