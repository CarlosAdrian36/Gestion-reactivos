import { apiClient } from '@/api/http'
import type { validate } from '../interface'
import { isAxiosError } from 'axios'

interface checkError {
  ok: false
}

interface checkSuccess {
  ok: true
  token: string
}

export const checkAuthAction = async (): Promise<checkError | checkSuccess> => {
  try {
    const localToken = localStorage.getItem('token')
    if (!localToken) {
      return { ok: false }
    }

    const { data } = await apiClient.get<boolean>('/sesion/validate')
    if (!data) {
      return { ok: false }
    }
    return {
      ok: data,
      token: localToken,
    }
  } catch (error) {
    console.log('en el checkauterror', error)
    if (isAxiosError(error) && error.response?.status === 401) {
      return {
        ok: false,
      }
    }

    throw new Error('No se pudo verificar  la sesion')
  }
}
