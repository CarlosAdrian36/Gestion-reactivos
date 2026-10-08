import { apiClient } from '@/api/http'
import type { ProyectoDetalle, ProyectoDetalleResponse } from '../interfaces/proyecto.interface'

export const getProyectoDetalleAction = async (id: string): Promise<ProyectoDetalle> => {
  try {
    const { data } = await apiClient.get<ProyectoDetalleResponse>(`/proyectos/${id}`)
    return data.proyecto
  } catch {
    throw new Error('Error al obtener el proyecto')
  }
}
