import { apiClient } from '@/api/http'
import type { DeleteCompartidoResponse } from '../interface/deleteCompartido.interface'

export const eliminarCompartido = async (
  bancoId: number,
  idCuenta: string,
): Promise<DeleteCompartidoResponse> => {
  const { data } = await apiClient.delete<DeleteCompartidoResponse>(
    `/bancos/${bancoId}/compartidos/${idCuenta}`,
  )

  return data
}
