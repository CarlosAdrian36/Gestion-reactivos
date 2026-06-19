import { apiClient } from '@/api/http'
import type { CarpetaARaiz } from '../interfaces/carpeta-raiz.interface'

export const moveCarpetaRaiz = async (Origen: string, Banco: string): Promise<CarpetaARaiz> => {
  const { data } = await apiClient.delete<CarpetaARaiz>(`/carpetas/${Origen}/bancos/${Banco}`)
  return data
}
