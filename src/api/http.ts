import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

//interceprtorts

// apiClient.interceptors.request.use((Config) => {
//   const token = localStorage.getItem('token')

//   if (token) {
//     Config.headers.Authorization = `Bearer ${token}`
//     console.log('Token agregado a la solicitud:', token)
//   }

//   return Config
// })

export { apiClient }
