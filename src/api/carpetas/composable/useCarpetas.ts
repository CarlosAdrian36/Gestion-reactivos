import { useQuery } from '@tanstack/vue-query'
import { getCarpetasAction } from '../actions/get-carpetas.actions'

export const useCarpetas = () => {
  return useQuery({
    queryKey: ['carpetas'],
    queryFn: getCarpetasAction,
    staleTime: 1000 * 60,
    refetchOnMount: true, // refetch si está stale al montar
    refetchOnWindowFocus: true, // refetch al volver a la pestaña
    refetchOnReconnect: true, // refetch al recuperar red
  })
}
