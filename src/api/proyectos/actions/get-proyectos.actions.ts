import { proyectosMock } from '../mock/proyectos.mock'
import type { BancoProyecto } from '../interfaces/proyecto.interface'

export const getProyectosAction = async (): Promise<BancoProyecto[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(proyectosMock)
    }, 500)
  })
}
