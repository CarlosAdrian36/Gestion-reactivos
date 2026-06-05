import type { Banco } from '@/api/bancos/interfaces/banco.interface'
import type { ItemUnificado } from '../interface/item-unificado.interface'
import type { Carpeta } from '@/api/carpetas/interfaces/carpeta.interface'

export const mapBanco = (banco: Banco): ItemUnificado => ({
  id: banco.bancoId,
  tipo: 'banco',
  nombre: banco.nombre,
  descripcion: banco.descripcion,
  fechaModificacion: banco.fechaModificacion,
  compartido: banco.esCompartido,
  esProyecto: banco.esProyecto,
  original: banco,
})

export const mapCarpeta = (carpeta: Carpeta): ItemUnificado => ({
  id: carpeta.carpetaId,
  tipo: 'carpeta',
  nombre: carpeta.nombre,
  fechaModificacion: carpeta.fechaModificacion,
  cantidadBancos: carpeta.cantidadBancos,
  original: carpeta,
})
