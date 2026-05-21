import { apiClient } from '@/api/http'
import type { LoginCredentials, LoginError, loginSuccess } from '../interface'
import { isAxiosError } from 'axios'

export const loginAction = async (data: LoginCredentials): Promise<loginSuccess | LoginError> => {
  try {
    const { usuario, contrasena } = data
    const { data: response } = await apiClient.post<loginSuccess>('/sesiones', {
      usuario,
      contrasena,
    })
    return {
      ok: true,
      token: response.token,
      tiempoRestante: response.tiempoRestante,
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
