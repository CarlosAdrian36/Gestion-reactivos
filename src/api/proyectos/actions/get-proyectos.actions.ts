import { apiClient } from '@/api/http'
import type { BancoProyecto, ProyectosResponse } from '../interfaces/proyecto.interface'

export const getProyectosAction = async (): Promise<BancoProyecto[]> => {
  try {
    const { data } = await apiClient.get<ProyectosResponse>('/proyectos')
    return data.proyectos
  } catch {
    throw new Error('Error al obtener los proyectos')
  }
}
