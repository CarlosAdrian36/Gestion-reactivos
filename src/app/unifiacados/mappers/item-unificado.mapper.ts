import type { Banco } from '@/api/bancos/interfaces/banco.interface'
import type { ItemUnificado } from '../interface/item-unificado.interface'
import type { Carpeta } from '@/api/carpetas/interfaces/carpeta.interface'

export const mapBanco = (banco: Banco): ItemUnificado => ({
  id: banco.idBanco,
  tipo: 'banco',
  nombre: banco.nombre,
  descripcion: banco.descripcion,
  fechaModificacion: banco.fechaModificacion,
  compartido: banco.esCompartido,
  esProyecto: banco.esProyecto,
  cantidadCompartidos: banco.cantidadCompartidos,
  cantidadReactivos: banco.cantidadReactivos,
  propietario: banco.propietario,
  original: banco,
})

export const mapCarpeta = (carpeta: Carpeta): ItemUnificado => ({
  id: carpeta.idCarpeta,
  tipo: 'carpeta',
  nombre: carpeta.nombre,
  fechaModificacion: carpeta.fechaModificacion,
  cantidadBancos: carpeta.cantidadBancos,
  propietario: carpeta.propietario,
  original: carpeta,
})
