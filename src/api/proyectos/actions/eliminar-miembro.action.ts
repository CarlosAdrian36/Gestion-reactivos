import { apiClient } from '@/api/http'
import { isAxiosError } from 'axios'
import type { EliminarMiembroResponse } from '@/api/proyectos/interfaces/proyecto.interface'

export const eliminarMiembroAction = async (
  idProyecto: string,
  idCuenta: string,
): Promise<void> => {
  try {
    const { data } = await apiClient.delete<EliminarMiembroResponse>(
      `/proyectos/${idProyecto}/Integrantes/${idCuenta}`,
      { data: {} },
    )

    if (!data.miembroEliminado) {
      throw new Error('El integrante no pudo eliminarse del proyecto')
    }
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.detail ?? `Error del servidor (${error.response?.status})`,
      )
    }
    throw new Error(error instanceof Error ? error.message : 'Error al eliminar el integrante')
  }
}
