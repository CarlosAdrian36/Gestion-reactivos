import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { Banco } from '@/api/bancos/interfaces/banco.interface'
import { getBancosAction } from '@/api/bancos/actions/get-bancos.actions'

export const useBancoStore = defineStore('bancos', () => {
  const bancos = ref<Banco[]>([])
  const selectedBanco = ref<Banco | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const proyectos = computed(() => bancos.value.filter((b) => b.esProyecto))

  async function fetchBancos() {
    if (loading.value) return
    loading.value = true
    error.value = null
    try {
      bancos.value = await getBancosAction()
    } catch (e) {
      error.value = 'Error al obtener los bancos'
    } finally {
      loading.value = false
    }
  }

  async function selectBancoById(id: string) {
    const found = bancos.value.find((b) => b.idBanco === id)
    if (found) {
      selectedBanco.value = found
      return
    }
    if (!loading.value) {
      await fetchBancos()
      selectedBanco.value = bancos.value.find((b) => b.idBanco === id) ?? null
    }
  }

  return { bancos, selectedBanco, loading, error, proyectos, fetchBancos, selectBancoById }
})
