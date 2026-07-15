export interface Usuario {
  cuentas: Cuenta[]
}

export interface Cuenta {
  idCuenta: string
  nombreUsuario: string
  esCuentaAcademica: boolean
  vigencia: boolean
  fechaExpiracion: null
  identidad: Identidad
  correos: Correo[]
  roles: Role[]
  organizacion: Organizacion
  fechaCreacion: string
  fechaModificacion: string
}

export interface Correo {
  correoId: number
  direccion: string
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

export interface Organizacion {
  organizacionId: number
  fechaCreacion: string
  fechaModificacion: string
}

export interface Role {
  rolId: number
  nombre: string
  fechaCreacion: string
  fechaModificacion: string
}

export interface getUsuario {
  cuentas: Cuenta
}
