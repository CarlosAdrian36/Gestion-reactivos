import { apiClient } from '@/api/http'
import type { ActualizarContrasenaRequest } from '../interface'
import { isAxiosError } from 'axios'

export interface ActualizarContrasenaResult {
  ok: boolean
  message?: string
}

export const actualizarContrasena = async (
  data: ActualizarContrasenaRequest,
): Promise<ActualizarContrasenaResult> => {
  try {
    await apiClient.patch('/cuenta/password', data)
    return { ok: true }
  } catch (error) {
    if (isAxiosError(error)) {
      const detail = error.response?.data?.detail ?? 'Error al actualizar la contraseña'
      return { ok: false, message: detail }
    }
    throw new Error('No se pudo hacer la petición de actualización de contraseña')
  }
}
