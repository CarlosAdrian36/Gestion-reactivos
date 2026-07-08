import { apiClient } from '@/api/http'
import type { SolicitarCambioContrasenaRequest } from '../interface'
import { isAxiosError } from 'axios'

export interface SolicitarCambioContrasenaResult {
  ok: boolean
  message?: string
}

export const solicitarCambioContrasena = async (
  data: SolicitarCambioContrasenaRequest,
): Promise<SolicitarCambioContrasenaResult> => {
  try {
    await apiClient.post('/password/reset/request', data)
    return { ok: true }
  } catch (error) {
    if (isAxiosError(error)) {
      const detail = error.response?.data?.detail ?? 'Error al solicitar el cambio de contraseña'
      return { ok: false, message: detail }
    }
    throw new Error('No se pudo hacer la petición de cambio de contraseña')
  }
}
