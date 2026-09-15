import { proyectosMock } from '../mock/proyectos.mock'
import type { BancoProyecto, Fase } from '../interfaces/proyecto.interface'
import type { Idioma } from '@/api/bancos/interfaces/banco.interface'

export interface CreateProyectoRequest {
  nombre: string
  descripcion?: string
  idiomas: Idioma[]
}

const FASES_BASE: Fase[] = [
  { nombre: 'Construccion', estado: 'Pendiente', funcion: 'Elaborador' },
  { nombre: 'Revision', estado: 'Pendiente', funcion: 'Revisor' },
]

const FASES_TRADUCCION: Fase[] = [
  { nombre: 'Traduccion', estado: 'Pendiente', funcion: 'Traductor' },
  { nombre: 'Revision traduccion', estado: 'Pendiente', funcion: 'Revisor de traduccion' },
]

export const createProyectoAction = async (
  proyecto: CreateProyectoRequest,
): Promise<BancoProyecto> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const conTraduccion = proyecto.idiomas.some((i) => i.idiomaId !== 1)
      const fases: Fase[] = [
        ...FASES_BASE,
        ...(conTraduccion ? FASES_TRADUCCION : []),
        { nombre: 'Finalizado', estado: 'Pendiente', funcion: null },
      ]

      const nuevo: BancoProyecto = {
        idBanco: `p${Date.now()}`,
        nombre: proyecto.nombre,
        descripcion: proyecto.descripcion ?? '',
        cantidadReactivos: 0,
        fechaCreacion: new Date().toISOString(),
        fechaModificacion: new Date().toISOString(),
        propietario: {
          idCuenta: 'u1',
          nombre: 'Carlos',
          apellidoPaterno: 'Arroyo',
          apellidoMaterno: 'Hernandez',
        },
        idiomas: proyecto.idiomas,
        esProyecto: true,
        fechaEntrega: '',
        tipoElementoId: 2,
        estado: { idEstado: 1, nombre: 'Pendiente' },
        funciones: [],
        fases,
        notificaciones: false,
      }

      proyectosMock.push(nuevo)
      resolve(nuevo)
    }, 500)
  })
}
