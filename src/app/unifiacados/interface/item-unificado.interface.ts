import type { Banco, Propietario } from '@/api/bancos/interfaces/banco.interface'
import type { Carpeta } from '@/api/carpetas/interfaces/carpeta.interface'

export type ItemUnificado = {
  id: string
  tipo: 'banco' | 'carpeta'
  nombre: string
  descripcion?: string
  fechaModificacion: Date | string
  compartido?: boolean
  esProyecto?: boolean
  cantidadBancos?: number
  cantidadCompartidos?: number
  cantidadReactivos?: number
  propietario: Propietario

  original: Banco | Carpeta
}
