import type { Carpeta } from '@/app/interface/carpetoInterface'
import { delay } from '@/lib/dealy'
import { carpetasMock } from './carpetas.mock'

export const getCarpetas = async (): Promise<Carpeta[]> => {
  await delay(500)
  return carpetasMock
}

export const getCarpetaById = async (id: number): Promise<Carpeta | undefined> => {
  await delay(500)

  return carpetasMock.find((carpeta) => carpeta.id === id)
}
