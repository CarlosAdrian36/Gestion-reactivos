import type { Banco } from '@/api/bancos/interfaces/banco.interface'
import type { Carpeta } from '@/api/carpetas/interfaces/carpeta.interface'

export type ItemUnificado = {
  id: number
  tipo: 'banco' | 'carpeta'
  nombre: string
  descripcion?: string
  fechaModificacion: Date | string
  compartido?: boolean
  cantidadBancos?: number
  esProyecto?: boolean
  cantidadCompartidos?: number
  cantidadReactivos?: number
  propietarioCuentaId?: number

  original: Banco | Carpeta
}
