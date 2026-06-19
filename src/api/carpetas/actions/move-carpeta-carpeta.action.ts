import { apiClient } from '@/api/http'
import type { MoveCarpetaCarpeta } from '../interfaces'

export const moveCarpetaCarpeta = async (
  Origen: string,
  Banco: string,
  Destino: string,
): Promise<MoveCarpetaCarpeta> => {
  const { data } = await apiClient.patch<MoveCarpetaCarpeta>(
    `/carpetas/${Origen}/bancos/${Banco}`,
    { carpetaId: Destino },
  )
  return data
}
