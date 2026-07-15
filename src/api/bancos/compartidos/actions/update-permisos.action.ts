import { apiClient } from '@/api/http'
import type { UpdatePermisoRequest } from '../interface/update-permisoRequest.interface'

export const actualizarPermiso = async (
  IdBanco: string,
  idCuenta: string,
  data: UpdatePermisoRequest,
) => {
  const response = await apiClient.put(`/bancos/${IdBanco}/compartidos/${idCuenta}/permisos`, data)

  return response.data
}
