import type { Hallazgo } from '@/api/proyectos/interfaces/proyecto.interface'

// Mock temporal: reemplazar por ConsultarHallazgosProyecto al conectar el servicio.
export const hallazgosMock: Hallazgo[] = [
  {
    hallazgoId: 'hallazgo-mock-1',
    idProyecto: 'proyecto-mock',
    idReactivo: 'reactivo-104',
    nombre: 'Revisar consistencia de la respuesta',
    descripcion:
      'La respuesta marcada como correcta no coincide con la explicación del reactivo. Revisar el contenido y confirmar la opción antes de continuar con la revisión.',
    fechaCreacion: '2026-10-27T15:20:00.000Z',
    fechaModificacion: '2026-10-28T09:45:00.000Z',
    propietario: {
      idCuenta: 'cuenta-mock-1',
      nombre: 'María',
      apellidoPaterno: 'García',
      apellidoMaterno: 'López',
    },
    funcion: { funcionId: 2, nombre: 'Revisor' },
  },
  {
    hallazgoId: 'hallazgo-mock-2',
    idProyecto: 'proyecto-mock',
    idReactivo: 'reactivo-218',
    nombre: 'Ajustar traducción al inglés',
    descripcion:
      'La traducción conserva el sentido general, pero la terminología técnica debe alinearse con el glosario del proyecto. Revisar también la redacción de las opciones.',
    fechaCreacion: '2026-10-26T11:10:00.000Z',
    fechaModificacion: '2026-10-26T11:10:00.000Z',
    propietario: {
      idCuenta: 'cuenta-mock-2',
      nombre: 'Carlos',
      apellidoPaterno: 'Hernández',
      apellidoMaterno: 'Ruiz',
    },
    funcion: { funcionId: 4, nombre: 'Traductor' },
  },
  {
    hallazgoId: 'hallazgo-mock-3',
    idProyecto: 'proyecto-mock',
    idReactivo: 'reactivo-305',
    nombre: 'Verificar referencia bibliográfica',
    descripcion:
      'La referencia utilizada en el planteamiento no incluye año de publicación. Confirmar la fuente y completar los datos bibliográficos.',
    fechaCreacion: '2026-10-24T17:35:00.000Z',
    fechaModificacion: '2026-10-25T08:20:00.000Z',
    propietario: {
      idCuenta: 'cuenta-mock-3',
      nombre: 'Ana',
      apellidoPaterno: 'Martínez',
      apellidoMaterno: 'Santos',
    },
    funcion: { funcionId: 1, nombre: 'Elaborador' },
  },
]
