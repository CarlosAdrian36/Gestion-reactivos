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
  {
    hallazgoId: 'hallazgo-mock-4',
    idProyecto: 'proyecto-mock',
    idReactivo: 'reactivo-412',
    nombre: 'Completar los datos del planteamiento',
    descripcion:
      'El planteamiento necesita especificar el contexto en el que ocurre el problema para que pueda responderse sin asumir información adicional.',
    fechaCreacion: '2026-10-23T13:05:00.000Z',
    fechaModificacion: '2026-10-24T10:40:00.000Z',
    propietario: {
      idCuenta: 'cuenta-mock-4',
      nombre: 'Luis',
      apellidoPaterno: 'Ramírez',
      apellidoMaterno: 'Cruz',
    },
    funcion: { funcionId: 2, nombre: 'Revisor' },
  },
  {
    hallazgoId: 'hallazgo-mock-5',
    idProyecto: 'proyecto-mock',
    idReactivo: 'reactivo-527',
    nombre: 'Verificar el uso de unidades',
    descripcion:
      'El enunciado y las opciones usan unidades distintas. Unificar el formato y confirmar que todas las respuestas sean comparables.',
    fechaCreacion: '2026-10-22T16:30:00.000Z',
    fechaModificacion: '2026-10-22T16:30:00.000Z',
    propietario: {
      idCuenta: 'cuenta-mock-5',
      nombre: 'Sofía',
      apellidoPaterno: 'Torres',
      apellidoMaterno: 'Vega',
    },
    funcion: { funcionId: 1, nombre: 'Elaborador' },
  },
  {
    hallazgoId: 'hallazgo-mock-6',
    idProyecto: 'proyecto-mock',
    idReactivo: 'reactivo-638',
    nombre: 'Revisar la traducción al francés',
    descripcion:
      'La traducción necesita una revisión de concordancia y de terminología para mantener consistencia con el resto del banco.',
    fechaCreacion: '2026-10-21T09:15:00.000Z',
    fechaModificacion: '2026-10-23T12:00:00.000Z',
    propietario: {
      idCuenta: 'cuenta-mock-6',
      nombre: 'Elena',
      apellidoPaterno: 'Flores',
      apellidoMaterno: 'Méndez',
    },
    funcion: { funcionId: 4, nombre: 'Traductor' },
  },
  {
    hallazgoId: 'hallazgo-mock-7',
    idProyecto: 'proyecto-mock',
    idReactivo: 'reactivo-704',
    nombre: 'Aclarar el criterio de evaluación',
    descripcion:
      'La respuesta esperada requiere explicar qué criterio permite distinguirla de los distractores. Añadir una justificación breve para facilitar la revisión.',
    fechaCreacion: '2026-10-20T14:25:00.000Z',
    fechaModificacion: '2026-10-21T08:10:00.000Z',
    propietario: {
      idCuenta: 'cuenta-mock-7',
      nombre: 'Jorge',
      apellidoPaterno: 'Castillo',
      apellidoMaterno: 'Núñez',
    },
    funcion: { funcionId: 2, nombre: 'Revisor' },
  },
  {
    hallazgoId: 'hallazgo-mock-8',
    idProyecto: 'proyecto-mock',
    idReactivo: 'reactivo-815',
    nombre: 'Corregir formato de las opciones',
    descripcion:
      'Las opciones no mantienen el mismo formato: algunas terminan en punto y otras no. Unificar la puntuación antes de publicar el reactivo.',
    fechaCreacion: '2026-10-19T10:00:00.000Z',
    fechaModificacion: '2026-10-19T10:00:00.000Z',
    propietario: {
      idCuenta: 'cuenta-mock-8',
      nombre: 'Patricia',
      apellidoPaterno: 'Mendoza',
      apellidoMaterno: 'Gil',
    },
    funcion: { funcionId: 1, nombre: 'Elaborador' },
  },
  {
    hallazgoId: 'hallazgo-mock-9',
    idProyecto: 'proyecto-mock',
    idReactivo: 'reactivo-926',
    nombre: 'Validar el nivel de dificultad',
    descripcion:
      'El reactivo parece evaluar un nivel distinto al indicado para esta sección. Confirmar la clasificación con el equipo académico.',
    fechaCreacion: '2026-10-18T12:45:00.000Z',
    fechaModificacion: '2026-10-20T09:30:00.000Z',
    propietario: {
      idCuenta: 'cuenta-mock-9',
      nombre: 'Roberto',
      apellidoPaterno: 'Sánchez',
      apellidoMaterno: 'Díaz',
    },
    funcion: { funcionId: 2, nombre: 'Revisor' },
  },
  {
    hallazgoId: 'hallazgo-mock-10',
    idProyecto: 'proyecto-mock',
    idReactivo: 'reactivo-1037',
    nombre: 'Uniformar un término técnico',
    descripcion:
      'El término usado en este reactivo difiere del glosario aprobado. Sustituirlo por la forma acordada y revisar sus apariciones en la traducción.',
    fechaCreacion: '2026-10-17T16:05:00.000Z',
    fechaModificacion: '2026-10-18T11:25:00.000Z',
    propietario: {
      idCuenta: 'cuenta-mock-10',
      nombre: 'Gabriela',
      apellidoPaterno: 'Ríos',
      apellidoMaterno: 'León',
    },
    funcion: { funcionId: 4, nombre: 'Traductor' },
  },
  {
    hallazgoId: 'hallazgo-mock-11',
    idProyecto: 'proyecto-mock',
    idReactivo: 'reactivo-1148',
    nombre: 'Confirmar la vigencia de la fuente',
    descripcion:
      'La fuente consultada podría estar desactualizada. Buscar una referencia reciente que respalde la información presentada.',
    fechaCreacion: '2026-10-16T08:50:00.000Z',
    fechaModificacion: '2026-10-16T08:50:00.000Z',
    propietario: {
      idCuenta: 'cuenta-mock-11',
      nombre: 'Daniel',
      apellidoPaterno: 'Vargas',
      apellidoMaterno: 'Pérez',
    },
    funcion: { funcionId: 1, nombre: 'Elaborador' },
  },
]
