import { defineStore } from 'pinia'
import type { Carpeta } from '../interface/carpetoInterface'
import { getCarpetas } from '@/api/carpetas/carpetas.api'

export const useFolderStore = defineStore('folders', {
  state: () => ({
    folders: [] as Carpeta[],
    loading: false,
  }),
  actions: {
    async fetchFolders() {
      try {
        this.loading = true
        this.folders = await getCarpetas()
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    },
  },
})
