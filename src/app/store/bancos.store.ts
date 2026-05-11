import { defineStore } from 'pinia'
import type { Banco } from '../interface/bancoInterface'
import { getBancos } from '@/api/bancos/bancos.api'

export const useBancoStore = defineStore('bancos', {
  state: () => ({
    bancos: [] as Banco[],
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
  },
})
