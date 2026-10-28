import { apiClient } from '@/api/http'
import { isAxiosError } from 'axios'
import type { LoginSuccessB } from '../interface/loginResponse'

export const actualizarRolSesionAction = async (rolId: number) => {
  try {
    const { data } = await apiClient.patch<LoginSuccessB>(
      '/sesion/role',
      undefined,
      { headers: { Rol: String(rolId) } },
    )
    return data.sesionDTO
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.detail ?? `Error del servidor (${error.response?.status})`,
      )
    }
    throw new Error('Error al cambiar el rol de la sesión')
  }
}
