import { apiClient } from '@/api/http'

export const validarSolicitudCambioContrasena = async (token: string): Promise<boolean> => {
  const { data } = await apiClient.get<boolean>('/password/reset/validate', {
    headers: { Token: token },
  })
  return data
}
