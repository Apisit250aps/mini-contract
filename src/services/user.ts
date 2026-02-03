import { User } from '@/models/entities/user'
import axios from 'axios'

async function createUserService({
  data,
}: {
  data: Partial<User>
}): Promise<User> {
  const result = await axios.post<ApiResponse<User>>('/api/user', data)
  if (result.data.error) {
    throw new Error(result.data.error)
  }
  return result.data.data!
}

async function getUserService({ id }: { id: string }): Promise<User> {
  const result = await axios.get<ApiResponse<User>>(`/api/user/${id}`)
  if (result.data.error) {
    throw new Error(result.data.error)
  }
  return result.data.data!
}

async function getAllUserService(): Promise<User[]> {
  const result = await axios.get<ApiResponse<User[]>>('/api/user')
  if (result.data.error) {
    throw new Error(result.data.error)
  }
  return result.data.data!
}

async function updateUserService({
  id,
  data,
}: {
  id: string
  data: Partial<User>
}): Promise<User> {
  const result = await axios.put<ApiResponse<User>>(`/api/user/${id}`, data)
  if (result.data.error) {
    throw new Error(result.data.error)
  }
  return result.data.data!
}
async function deleteUserService({ id }: { id: string }): Promise<void> {
  const result = await axios.delete<ApiResponse<null>>(`/api/user/${id}`)
  if (result.data.error) {
    throw new Error(result.data.error)
  }
  return
}
export {
  createUserService,
  getUserService,
  getAllUserService,
  updateUserService,
  deleteUserService,
}
