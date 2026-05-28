import { apiClient } from '@/api/http'
import type { validate } from '../interface'
import { isAxiosError } from 'axios'

interface checkError {
  ok: false
}

interface checkSuccess {
  ok: boolean
}

export const checkAuthAction = async (): Promise<checkError | checkSuccess> => {
  try {
    const localToken = localStorage.getItem('token')
    if (!localToken || localToken.length < 10) {
      return { ok: false }
    }

    const { data } = await apiClient.get<validate>('/sesion/validate')
    console.log(data)
    return {
      ok: data.ok,
    }
  } catch (error) {
    console.log(error)
    if (isAxiosError(error) && error.response?.status === 401) {
      return {
        ok: false,
      }
    }

    throw new Error('No se pudo verificar  la sesion')
  }
}
