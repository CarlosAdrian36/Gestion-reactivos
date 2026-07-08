export interface SolicitarCambioContrasenaRequest {
  nombreUsuario: string
  correoElectronico: string
}

export interface SolicitarCambioContrasenaResponse {
  solicitudCreada: boolean
}
