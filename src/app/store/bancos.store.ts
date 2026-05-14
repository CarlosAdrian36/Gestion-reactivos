import { defineStore } from 'pinia'
import type { Banco } from '../interface/bancoInterface'
import { getBancos, getBancoById } from '@/api/bancos/bancos.api'

export const useBancoStore = defineStore('bancos', {
  state: () => ({
    bancos: [] as Banco[],
    selectedBanco: null as Banco | null,
    loading: false,
  }),
  getters: {
    proyectos: (state) => state.bancos.filter((banco) => banco.esProyecto),
    compartidos: (state) => state.bancos.filter((banco) => banco.esCompartido),
    misbancos: (state) => state.bancos.filter((banco) => !banco.esProyecto),
  },
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
      const existenteBanco = this.bancos.find((banco) => banco.id === id)
      if (existenteBanco) {
        this.selectedBanco = existenteBanco
        return
      }

      const banco = await getBancoById(id)
      this.selectedBanco = banco ?? null
    },
  },
})
