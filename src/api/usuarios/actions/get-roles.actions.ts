import { apiClient } from '@/api/http'
import type { Rol, RolesResponse } from '../interfaces/roles.interface'

export const getRolesAction = async (): Promise<Rol[]> => {
  try {
    const { data } = await apiClient.get<RolesResponse>('/roles')
    console.log(data)
    return data.roles
  } catch (error) {
    throw new Error('Error')
  }
}
