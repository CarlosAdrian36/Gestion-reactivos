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
    if (isAxiosError(error)) {
      if (!error.response || error.response.status >= 500) {
        return { ok: false, message: '' }
      }
      return { ok: false, message: error.response?.data?.detail ?? '' }
    }
    return { ok: false, message: '' }
  }
}
