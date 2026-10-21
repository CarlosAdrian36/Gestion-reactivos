import { apiClient } from '@/api/http'
import { isAxiosError } from 'axios'
import type { UpdateUserRequest } from '../interfaces/updateUser.interface'
import type { CreateUserResponse } from '../interfaces/user-response.interface'

export const updateUser = async (
  idCuenta: string,
  user: UpdateUserRequest,
): Promise<CreateUserResponse> => {
  try {
    console.warn('updateUser', idCuenta, user)
    const { data } = await apiClient.patch<CreateUserResponse>(`/cuentas/${idCuenta}`, user)
    return data
  } catch (error) {
    if (isAxiosError(error)) {
      console.log(error)
    }
    throw error
  }
}
