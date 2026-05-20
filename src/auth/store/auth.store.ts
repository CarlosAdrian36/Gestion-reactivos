import { defineStore } from 'pinia'
import type { LoginRequest } from '../interface/loginRequest'
import { loginApi } from '../api/auth.api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    tiempoRestante: localStorage.getItem('tiempoRestante') || null,
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.token),
  },
  actions: {
    async login(credenciales: LoginRequest) {
      //   console.log('Intentando iniciar sesión con:', credenciales)
      const response = await loginApi({
        nombreUsuario: credenciales.nombreUsuario,
        password: credenciales.password,
      })
      //   console.log('Respuesta del servidor:', response)
      this.token = response.token
      this.tiempoRestante = response.tiempoRestante
      localStorage.setItem('token', response.token)
      localStorage.setItem('tiempoRestante', response.tiempoRestante)
    },
    logout() {
      this.token = null
      this.tiempoRestante = null
      localStorage.removeItem('token')
      localStorage.removeItem('tiempoRestante')
    },
  },
})
