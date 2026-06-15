import { apiClient } from '@/api/http'
import type { Cuenta, Usuario } from '../interfaces/ususarios.interface'

export const getUsuariosAction = async (): Promise<Cuenta[]> => {
  try {
    const { data } = await apiClient.get<Usuario>('/cuentas')
    console.log(data)
    return data.cuentas
  } catch (error) {
    throw new Error('Error')
  }
}
