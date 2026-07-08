export interface ActualizarContrasenaRequest {
  password: string
  passwordNuevo: string
}

export interface ActualizarContrasenaResponse {
  contrasenaActualizada: boolean
}
