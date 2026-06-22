export interface Rol {
  rolId: number
  nombre: string
  descripcion: string
  fechaCreacion: string
  fechaModificacion: string
}
export interface RolesResponse {
  roles: Rol[]
}
