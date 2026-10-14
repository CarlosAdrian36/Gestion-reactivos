import { apiClient } from '@/api/http'
import { isAxiosError } from 'axios'
import type {
  AsignarFuncionRequest,
  AsignarFuncionResponse,
} from '@/api/proyectos/interfaces/proyecto.interface'

export const asignarFuncionAction = async (
  idProyecto: string,
  idCuenta: string,
  body: AsignarFuncionRequest,
): Promise<AsignarFuncionResponse> => {
  try {
    const { data } = await apiClient.put<AsignarFuncionResponse>(
      `/proyectos/${idProyecto}/Funciones/${idCuenta}`,
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