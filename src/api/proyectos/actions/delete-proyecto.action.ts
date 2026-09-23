import { apiClient } from '@/api/http'

interface EliminarProyectoResponse {
  proyectoEliminado: boolean
}

export const deleteProyecto = async (proyectoId: string): Promise<void> => {
  const { data } = await apiClient.delete<EliminarProyectoResponse>(
    `/proyectos/${proyectoId}`,
    { data: {} },
  )

  if (!data.proyectoEliminado) {
    throw new Error('El proyecto no pudo eliminarse')
  }
}
