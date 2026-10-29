import { apiClient } from '@/api/http'
import { isAxiosError } from 'axios'
import type {
  ActualizarFuncionMiembroRequest,
  ActualizarFuncionMiembroResponse,
} from '@/api/proyectos/interfaces/proyecto.interface'

export const actualizarFuncionesMiembroAction = async (
  idProyecto: string,
  idCuenta: string,
  body: ActualizarFuncionMiembroRequest,
): Promise<ActualizarFuncionMiembroResponse> => {
  try {
    const { data } = await apiClient.put<ActualizarFuncionMiembroResponse>(
      `/proyectos/${idProyecto}/Integrantes/${idCuenta}/Funciones`,
      body,
    )
    return data
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.detail ?? `Error del servidor (${error.response?.status})`,
      )
    }
    throw new Error('Error al conectar con el servidor')
  }
}
