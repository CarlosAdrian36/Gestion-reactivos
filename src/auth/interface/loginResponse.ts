export interface SesionDTO {
  token: string
  tiempoRestante: number
}

export interface LoginSuccessB {
  sesionDTO: SesionDTO
}
