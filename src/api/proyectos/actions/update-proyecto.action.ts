import { apiClient } from '@/api/http'
import { isAxiosError } from 'axios'
import type {
  BancoProyecto,
  UpdateProyectoRequest,
  UpdateProyectoResponse,
} from '@/api/proyectos/interfaces/proyecto.interface'

export const updateProyectoAction = async (
  idProyecto: string,
  body: UpdateProyectoRequest,
): Promise<BancoProyecto> => {
  try {
    const { data } = await apiClient.post<UpdateProyectoResponse>(`/proyectos/${idProyecto}`, body)
    return data.proyectos
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.detail ?? `Error del servidor (${error.response?.status})`,
      )
    }
    throw new Error('Error al conectar con el servidor')
  }
}