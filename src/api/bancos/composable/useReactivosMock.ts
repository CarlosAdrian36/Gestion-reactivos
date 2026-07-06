import { useQuery } from '@tanstack/vue-query'
import type { Reactivo } from '../interfaces/reactivo.interface'

const mockReactivos: Reactivo[] = [
  {
    IDReactivo: 'RE-1045',
    IdiomaId: 1,
    TipoReactivoId: 1,
    Version: 3,
    Descripcion:
      'Calculate the area of the shaded region if the radius is 5cm and the angle is 45 degrees. Use π = 3.1416 and round your answer to two decimal places.',
    FechaModificacion: '2025-06-12T14:30:00',
    FechaCreacion: '2024-09-01T10:00:00',
    NivelCognitivo: { NivelCognitivoId: 3, Descripcion: 'Apply' },
    SubTema: { SubTemaId: 5, Descripcion: 'Geometry' },
  },
  {
    IDReactivo: 'RE-1042',
    IdiomaId: 2,
    TipoReactivoId: 1,
    Version: 2,
    Descripcion:
      'Resuelve para x en la siguiente ecuación cuadrática: 2x² + 5x - 3 = 0. Selecciona la opción que contiene ambas soluciones correctas.',
    FechaModificacion: '2025-06-15T09:15:00',
    FechaCreacion: '2024-08-20T08:00:00',
    NivelCognitivo: { NivelCognitivoId: 3, Descripcion: 'Apply' },
    SubTema: { SubTemaId: 2, Descripcion: 'Algebra' },
  },
  {
    IDReactivo: 'RE-1038',
    IdiomaId: 1,
    TipoReactivoId: 1,
    Version: 1,
    Descripcion:
      'Determine the derivative of f(x) = sin(x) * e^x using the product rule. Express your answer in its simplest form.',
    FechaModificacion: '2025-06-10T11:45:00',
    FechaCreacion: '2024-07-15T14:00:00',
    NivelCognitivo: { NivelCognitivoId: 4, Descripcion: 'Analyze' },
    SubTema: { SubTemaId: 8, Descripcion: 'Calculus' },
  },
  {
    IDReactivo: 'RE-1021',
    IdiomaId: 1,
    TipoReactivoId: 1,
    Version: 1,
    Descripcion: 'If 3x + 7 = 22, what is the value of 2x - 5?',
    FechaModificacion: '2025-06-08T16:20:00',
    FechaCreacion: '2024-06-01T09:00:00',
    NivelCognitivo: { NivelCognitivoId: 2, Descripcion: 'Understand' },
    SubTema: { SubTemaId: 2, Descripcion: 'Algebra' },
  },
  {
    IDReactivo: 'RE-1032',
    IdiomaId: 1,
    TipoReactivoId: 1,
    Version: 2,
    Descripcion:
      'Find the value of sin(π/3) expressed in its exact radical form. Show your work step by step.',
    FechaModificacion: '2025-06-05T10:00:00',
    FechaCreacion: '2024-08-10T11:30:00',
    NivelCognitivo: { NivelCognitivoId: 3, Descripcion: 'Apply' },
    SubTema: { SubTemaId: 7, Descripcion: 'Trigonometry' },
  },
  {
    IDReactivo: 'RE-1015',
    IdiomaId: 1,
    TipoReactivoId: 1,
    Version: 3,
    Descripcion:
      'A dataset has a mean of 50 and a standard deviation of 5. What percentage of data falls within one standard deviation of the mean in a normal distribution?',
    FechaModificacion: '2025-06-01T08:00:00',
    FechaCreacion: '2024-05-20T07:00:00',
    NivelCognitivo: { NivelCognitivoId: 2, Descripcion: 'Understand' },
    SubTema: { SubTemaId: 12, Descripcion: 'Statistics' },
  },
]

export function useReactivosMock() {
  return useQuery({
    queryKey: ['reactivosMock'],
    queryFn: async () => mockReactivos as Reactivo[],
    staleTime: Infinity,
  })
}
