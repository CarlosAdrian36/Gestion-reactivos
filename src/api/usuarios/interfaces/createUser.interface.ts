export interface CreateUserRequest {
  nombreUsuario: string
  vigencia: boolean
  correo: string
  rol: string
  nombre: string
  apellidoPaterno: string
  apellidoMaterno?: string
  curp?: string
  fechaExpiracion?: string
}
