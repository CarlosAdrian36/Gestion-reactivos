import { getCarpetasAction } from '@/api/carpetas/actions/get-carpetas.actions'
import { getBancosAction } from '@/api/bancos/actions'
import { mapBanco, mapCarpeta } from '../mappers/item-unificado.mapper'
import type { ItemUnificado } from '../interface/item-unificado.interface'

export const getItemsUnificadosAction = async (): Promise<ItemUnificado[]> => {
  const [bancos, carpetas] = await Promise.all([getBancosAction(), getCarpetasAction()])
  console.log('bancos', bancos)
  console.log('carpetas', carpetas)
  return [...bancos.map(mapBanco), ...carpetas.map(mapCarpeta)]
}
