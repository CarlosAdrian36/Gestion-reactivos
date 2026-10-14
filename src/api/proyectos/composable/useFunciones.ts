import { useQuery } from '@tanstack/vue-query'
import { getFuncionesAction } from '@/api/proyectos/actions/get-funciones.action'

export const useFunciones = () =>
  useQuery({
    queryKey: ['proyectos-funciones'],
    queryFn: getFuncionesAction,
    staleTime: 1000 * 60 * 5,
  })