import { apiClient } from '@/api/http'
import { isAxiosError } from 'axios'
import type { CreateUserResponse } from '../interfaces/user-response.interface'
import type { CreateUserRequest } from '../interfaces/createUser.interface'

export const saveUser = async (user: CreateUserRequest): Promise<CreateUserResponse> => {
  try {
    const { data } = await apiClient.post<CreateUserResponse>('/cuentas', user)
    return data
  } catch (error) {
    if (isAxiosError(error)) {
      console.log(error)
    }
    throw error
  }
}
