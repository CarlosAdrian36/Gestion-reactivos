import { useQuery } from '@tanstack/vue-query'
import { apiClient } from '@/api/http'
import type { Reactivo } from '../interfaces/reactivo.interface'

export function useReactivos(bancoId: string) {
  return useQuery({
    queryKey: ['reactivos', bancoId],
    queryFn: async () => {
      const { data } = await apiClient.get<{ reactivos: Reactivo[] }>(`/bancos/${bancoId}/reactivos`)
      return data.reactivos
    },
  })
}
