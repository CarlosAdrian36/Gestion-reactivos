import { apiClient } from '@/api/http'
import { isAxiosError } from 'axios'

interface DeleteUserResponse {
  cuentaEliminada: boolean
}

export const deleteUser = async (guid: string): Promise<boolean> => {
  try {
    const { data } = await apiClient.delete<DeleteUserResponse>(`/cuentas/${guid}`)
    return data.cuentaEliminada
  } catch (error) {
    if (isAxiosError(error)) {
      console.log(error)
    }
    throw error
  }
}
