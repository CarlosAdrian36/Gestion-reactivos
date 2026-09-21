import { apiClient } from '@/api/http'
import type { BancoProyecto } from '../interfaces/proyecto.interface'

export interface CreateProyectoRequest {
  nombre: string
  descripcion?: string
  idiomas?: string[] // etiquetas: 'es_MX', 'en_US', 'fr_FR'
}

interface CrearBancoProyectoResponse {
  proyecto: BancoProyecto
}

export const createProyectoAction = async (
  proyecto: CreateProyectoRequest,
): Promise<BancoProyecto> => {
  const { data } = await apiClient.post<CrearBancoProyectoResponse>('/proyectos', proyecto)
  return data.proyecto
}
