import { apiClient } from '@/api/http'
import type {
  ConsultarFuncionesResponse,
  Funcion,
} from '@/api/proyectos/interfaces/proyecto.interface'

export const getFuncionesAction = async (): Promise<Funcion[]> => {
  try {
    const { data } = await apiClient.get<ConsultarFuncionesResponse>('/proyectos/funciones')
    return data.funciones ?? []
  } catch {
    throw new Error('Error al obtener las funciones')
  }
}