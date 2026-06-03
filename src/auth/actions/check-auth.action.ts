import { apiClient } from '@/api/http'
import type { validate } from '../interface'
import { isAxiosError } from 'axios'

interface checkError {
  ok: false
}

interface checkSuccess {
  ok: true
}

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
    console.log('en el checkauterror', error)
    if (isAxiosError(error) && error.response?.status === 401) {
      return false
    }

    throw new Error('No se pudo verificar  la sesion')
  }
}
