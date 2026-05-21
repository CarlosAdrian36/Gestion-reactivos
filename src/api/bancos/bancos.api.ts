import type { Banco } from '@/app/interface/bancoInterface'
import { bancosMock } from './bancos.mock'
import { delay } from '@/lib/dealy'

export const getBancos = async (): Promise<Banco[]> => {
  await delay(2000)

  return bancosMock
}

export const getBancoById = async (id: number): Promise<Banco | undefined> => {
  await delay(500)
  return bancosMock.find((banco) => banco.id === id)
}
