import client from '@/lib/client'
import { onErrorMessage } from '@/lib/utils'
import { User } from '@/models/entities/user'

async function createUserService({
  data,
}: {
  data: Partial<User>
}): Promise<User> {
  const result = await client.post<ApiResponse<User>>('/api/user', data)
  if (result.data.error) {
    throw new Error(result.data.message)
  }
  return result.data.data!
}

async function getUserService({ id }: { id: string }): Promise<User> {
  try {
    const result = await client.get<ApiResponse<User>>(`/api/user/${id}`)
    if (result.data.error) {
      throw new Error(result.data.message)
    }
    return result.data.data!
  } catch (error) {
    throw new Error(onErrorMessage(error))
  }
}

async function getAllUserService(): Promise<User[]> {
  try {
    const result = await client.get<ApiResponse<User[]>>('/api/user')
    if (result.data.error) {
      throw new Error(result.data.message)
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
    const result = await client.put<ApiResponse<User>>(`/api/user/${id}`, data)
    if (result.data.error) {
      throw new Error(result.data.message)
    }
    return result.data.data!
  } catch (error) {
    throw new Error(onErrorMessage(error))
  }
}
async function deleteUserService({ id }: { id: string }): Promise<void> {
  try {
    const result = await client.delete<ApiResponse<null>>(`/api/user/${id}`)
    if (result.data.error) {
      throw new Error(result.data.message)
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
