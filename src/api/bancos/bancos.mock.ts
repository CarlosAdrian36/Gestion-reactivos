import type { Banco } from '@/app/interface/bancoInterface'

export const bancosMock: Banco[] = [
  {
    id: 1,
    nombre: 'ESC-BR-EMT-FyR-2025 ',
    descripcion: 'ESC-BR-EMT-FyR-2025',
    fechaModificacion: '2026-05-10',
    fechaCreacion: '2026-05-01',
    reactivos: 25,
    estatus: 'activo',
    esCompartido: true,
    esProyecto: false,
    carpetaId: 1,
  },
  {
    id: 2,
    nombre:
      'Física Ikjsdhkjshdckjhskcjhk3jfcjjcjsjcjdcssdchskjcdhkjsdhckjrhcruucw48cksjhdbcuw4kcw84uwecnwcnr484ekc5765ksjhv8ref5ue8n5feifkjhkjhkjrh',
    descripcion: 'Banco para examen parcial',
    fechaModificacion: '2026-05-08',
    fechaCreacion: '2026-05-01',
    reactivos: 12,
    estatus: 'borrador',
    esCompartido: false,
    esProyecto: true,
    carpetaId: null,
  },
]
