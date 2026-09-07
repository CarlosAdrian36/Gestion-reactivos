import { apiClient } from '@/api/http'
import type { EstablecerContrasenaRequest } from '../interface/establecer.interface'

export const establecerContrasena = async (
  password: EstablecerContrasenaRequest,
  token: string,
) => {
  console.log('payload', password)
  console.log('token', token)
  const { data } = await apiClient.post('/password/reset', password, {
    headers: {
      Token: token,
    },
  })
  return data
}
