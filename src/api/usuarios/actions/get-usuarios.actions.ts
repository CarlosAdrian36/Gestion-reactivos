import { apiClient } from '@/api/http'
import type { Cuenta, Usuario } from '../interfaces/ususarios.interface'

export const getUsuariosAction = async (rolId?: number): Promise<Cuenta[]> => {
  try {
    const config = rolId == null ? undefined : { headers: { Rol: String(rolId) } }
    const { data } = await apiClient.get<Usuario>('/cuentas', config)
    console.log(data)
    return data.cuentas
  } catch {
    throw new Error('Error')
  }
}
