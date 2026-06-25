export interface UpdateUserRequest {
  nombreUsuario: string
  vigencia: boolean
  nombre: string
  apellidoPaterno: string
  apellidoMaterno?: string | null
  curp?: string | null
  fechaExpiracion?: string | null
}
