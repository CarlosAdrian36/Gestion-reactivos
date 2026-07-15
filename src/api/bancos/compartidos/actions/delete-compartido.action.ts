import { apiClient } from '@/api/http'
import type { DeleteCompartidoResponse } from '../interface/deleteCompartido.interface'

export const eliminarCompartido = async (
  IdBanco: string,
  idCuenta: string,
): Promise<DeleteCompartidoResponse> => {
  const { data } = await apiClient.delete<DeleteCompartidoResponse>(
    `/bancos/${IdBanco}/compartidos/${idCuenta}`,
  )

  return data
}
