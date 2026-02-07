import axios, { AxiosError } from 'axios'

const client = axios.create({})
client.interceptors.response.use(
  (response) => response,
  (error: AxiosError) =>
    Promise.resolve({
      ...error,
    }),
)
export default client
