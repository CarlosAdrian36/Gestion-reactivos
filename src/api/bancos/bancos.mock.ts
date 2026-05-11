import type { Banco } from '@/app/interface/bancoInterface'

export const bancosMock: Banco[] = [
  {
    id: 1,
    nombre: 'Álgebra Básica',
    descripcion: 'Banco de reactivos de álgebra',
    fecha: '2026-05-10',
    reactivos: 25,
    estatus: 'activo',
    esCompartido: true,
    esProyecto: false,
    carpetaId: 1,
  },

  {
    id: 2,
    nombre: 'Física I',
    descripcion: 'Banco para examen parcial',
    fecha: '2026-05-08',
    reactivos: 12,
    estatus: 'borrador',
    esCompartido: false,
    esProyecto: true,
    carpetaId: null,
  },
]
