import type { BancoProyecto } from '../interfaces/proyecto.interface'
import { getProyectosAction } from './get-proyectos.actions'

// This action can later switch to GET /proyectos/:id without changing the detail view.
export const getProyectoDetalleAction = async (idProyecto: string): Promise<BancoProyecto> => {
  const proyectos = await getProyectosAction()
  const proyecto = proyectos.find((item) => item.idProyecto === idProyecto)

  if (!proyecto) {
    throw new Error('Proyecto no encontrado')
  }

  return proyecto
}
