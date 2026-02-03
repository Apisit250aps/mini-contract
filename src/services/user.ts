import client from '@/lib/client'
import { onErrorMessage } from '@/lib/utils'
import { User } from '@/models/entities/user'
import axios from 'axios'
import { on } from 'events'

async function createUserService({
  data,
}: {
  data: Partial<User>
}): Promise<User> {
  const result = await client.post('/api/user', data)
  console.log('result', result)
  if (result.data) {
    throw new Error(result.data.message)
  }
  return result.data.data
}

async function getUserService({ id }: { id: string }): Promise<User> {
  try {
    const result = await axios.get<ApiResponse<User>>(`/api/user/${id}`)
    if (result.data.error) {
      throw new Error(result.data.error)
    }
    return result.data.data!
  } catch (error) {
    throw new Error(onErrorMessage(error))
  }
}

async function getAllUserService(): Promise<User[]> {
  try {
    const result = await axios.get<ApiResponse<User[]>>('/api/user')
    if (result.data.error) {
      throw new Error(result.data.error)
    }
    return result.data.data!
  } catch (error) {
    throw new Error(onErrorMessage(error))
  }
}

async function updateUserService({
  id,
  data,
}: {
  id: string
  data: Partial<User>
}): Promise<User> {
  try {
    const result = await axios.put<ApiResponse<User>>(`/api/user/${id}`, data)
    if (result.data.error) {
      throw new Error(result.data.error)
    }
    return result.data.data!
  } catch (error) {
    throw new Error(onErrorMessage(error))
  }
}
async function deleteUserService({ id }: { id: string }): Promise<void> {
  try {
    const result = await axios.delete<ApiResponse<null>>(`/api/user/${id}`)
    if (result.data.error) {
      throw new Error(result.data.error)
    }
    return
  } catch (error) {
    throw new Error(onErrorMessage(error))
  }
}
export {
  createUserService,
  getUserService,
  getAllUserService,
  updateUserService,
  deleteUserService,
}
