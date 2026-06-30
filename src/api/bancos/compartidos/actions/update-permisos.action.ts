import { apiClient } from '@/api/http'
import type { UpdatePermisoRequest } from '../interface/update-permisoRequest.interface'

export const actualizarPermiso = async (
  bancoId: number,
  idCuenta: string,
  data: UpdatePermisoRequest,
) => {
  const response = await apiClient.put(`/bancos/${bancoId}/compartidos/${idCuenta}/permisos`, data)

  return response.data
}
