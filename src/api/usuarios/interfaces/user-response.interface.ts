export interface CreateUserResponse {
  cuenta: Cuenta
}

export interface Cuenta {
  guid: string
  nombreUsuario: string
  esCuentaAcademica: boolean
  vigencia: boolean
  fechaExpiracion: string | null

  identidad: Identidad

  correos: Correo[]

  roles: Rol[]

  organizacion: Organizacion

  fechaCreacion: string
  fechaModificacion: string
}

export interface Identidad {
  nombre: string
  apellidoPaterno: string
  apellidoMaterno: string
  curp: string
  fechaCreacion: string
  fechaModificacion: string
}

export interface Correo {
  correoId: string
  direccion: string
  fechaCreacion: string
  fechaModificacion: string
}

export interface Rol {
  rolId: string
  nombre: string
  fechaCreacion: string
  fechaModificacion: string
}

export interface Organizacion {
  organizacionId: string
  fechaCreacion: string
  fechaModificacion: string
}
