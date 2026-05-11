import { defineStore } from 'pinia'
import type { Banco } from '../interface/bancoInterface'
import { getBancos, getBancoById } from '@/api/bancos/bancos.api'

export const useBancoStore = defineStore('bancos', {
  state: () => ({
    bancos: [] as Banco[],
    selectedBanco: null as Banco | null,
    loading: false,
  }),
  actions: {
    async fetchBancos() {
      try {
        this.loading = true
        this.bancos = await getBancos()
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    },
    async fetchBancoById(id: number) {
      try {
        this.loading = true
        const banco = await getBancoById(id)
        if (!banco) {
          throw new Error('Banco no encontrado')
        }
        this.selectedBanco = banco
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    },
  },
})
