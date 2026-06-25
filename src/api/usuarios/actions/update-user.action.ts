import { apiClient } from '@/api/http'
import { isAxiosError } from 'axios'
import type { UpdateUserRequest } from '../interfaces/updateUser.interface'
import type { CreateUserResponse } from '../interfaces/user-response.interface'

export const updateUser = async (guid: string, user: UpdateUserRequest): Promise<CreateUserResponse> => {
  try {
    const { data } = await apiClient.patch<CreateUserResponse>(`/cuentas/${guid}`, user)
    return data
  } catch (error) {
    if (isAxiosError(error)) {
      console.log(error)
    }
    throw error
  }
}
