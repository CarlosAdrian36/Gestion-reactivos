import { useQuery } from '@tanstack/vue-query'
import { getInstruccionesGruposAction } from '../actions/get-instrucciones-grupos.action'

export function useInstruccionesGrupos(bancoId: string) {
  return useQuery({
    queryKey: ['instruccionesGrupos', bancoId],
    queryFn: () => getInstruccionesGruposAction(bancoId),
  })
}
