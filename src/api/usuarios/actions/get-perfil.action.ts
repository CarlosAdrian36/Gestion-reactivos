import { apiClient } from '@/api/http'
import type { PerfilResponse } from '@/auth/interface/perfil-response.interface'
import type { Cuenta } from '@/auth/interface/user.interface'

export const getPerfilAction = async (): Promise<Cuenta> => {
  try {
    const { data } = await apiClient.get<PerfilResponse>('/perfil')
    console.log('Perfil data:', data) // Log the response data for debugging
    return data.cuenta
  } catch (error) {
    throw new Error('Error al obtener el perfil')
  }
}
