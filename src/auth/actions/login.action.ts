import { apiClient } from '@/api/http'
import type { LoginCredentials, LoginError, LoginSuccess, LoginSuccessB } from '../interface'
import { isAxiosError } from 'axios'

export const loginAction = async (data: LoginCredentials): Promise<LoginSuccess | LoginError> => {
  try {
    const { nombreUsuario, password } = data
    const { data: response } = await apiClient.post<LoginSuccessB>('/sesion', {
      nombreUsuario,
      password,
    })
    return {
      ok: true,
      token: response.sesionDTO.token,
      tiempoRestante: response.sesionDTO.tiempoRestante,
    }
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 401) {
      return {
        ok: false,
        message: 'Credenciales inválidas',
      }
    }
    throw new Error('No se pudo hacer la petición de inicio de sesión')
  }
}
