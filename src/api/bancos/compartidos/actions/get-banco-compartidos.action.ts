import { apiClient } from '@/api/http'
import type { ListaPersonasCompartidas } from '../interface/listaPersonasCompartidas.interfcae'

export const getListaPersonasCompartidas = async (
  bancoId: string,
): Promise<ListaPersonasCompartidas> => {
  const { data } = await apiClient.get<ListaPersonasCompartidas>(`/bancos/${bancoId}/compartidos`)
  console.log(data)
  return data
}
