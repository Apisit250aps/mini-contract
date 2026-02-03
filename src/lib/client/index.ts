import axios, { AxiosError, AxiosResponse, isAxiosError } from 'axios'

const client = axios.create({})
client.interceptors.response.use(
  <T>(response: AxiosResponse): AxiosResponse<ApiResponse<T>> => {
    console.log('success response >>', isAxiosError(response))
    return {
      ...response,
    }
  },
  (error: AxiosError) => {
    console.log('error response >>', isAxiosError(error))
    return Promise.resolve({
      ...error,
    })
  },
)
export default client
