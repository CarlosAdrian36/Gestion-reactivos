import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.API_URL,
})

console.log(import.meta.env)

//interceprtorts

export { apiClient }
