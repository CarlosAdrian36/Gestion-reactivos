import { apiClient } from '@/api/http'
import type {
  ConsultarIntegrantesResponse,
  Integrante,
} from '@/api/proyectos/interfaces/proyecto.interface'

export const getIntegrantesAction = async (idProyecto: string): Promise<Integrante[]> => {
  try {
    const { data } = await apiClient.get<ConsultarIntegrantesResponse>(
      `/proyectos/${idProyecto}/Integrantes`,
    )
    return data.integrantes ?? []
  } catch {
    throw new Error('Error al obtener los integrantes del proyecto')
  }
}