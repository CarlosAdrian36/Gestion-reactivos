import { apiClient } from '@/api/http'
import { isAxiosError } from 'axios'

export const checkAuthAction = async (): Promise<boolean> => {
  try {
    const localToken = localStorage.getItem('token')
    if (!localToken) {
      return false
    }

    const { data } = await apiClient.get<boolean>('/sesion/validate')
    if (!data) {
      return false
    }
    return true
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 401) {
      return false
    }

    throw new Error('No se pudo verificar  la sesion')
  }
}
