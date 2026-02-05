import client from '@/lib/client'
import { onErrorMessage } from '@/lib/utils'
import { Worker } from '@/models/entities/worker'
export async function createWorkerService(
  data: Partial<Worker>,
): Promise<Worker> {
  try {
    const result = await client.post<ApiResponse<Worker>>('/api/worker', data)
    if (result.data.error) {
      throw new Error(result.data.message)
    }
    return result.data.data!
  } catch (error) {
    throw new Error(onErrorMessage(error))
  }
}

export async function getWorkerService({
  id,
}: {
  id: string
}): Promise<Worker> {
  try {
    const result = await client.get<ApiResponse<Worker>>(`/api/worker/${id}`)
    if (result.data.error) {
      throw new Error(result.data.message)
    }
    return result.data.data!
  } catch (error) {
    throw new Error(onErrorMessage(error))
  }
}

export async function getAllWorkerService(): Promise<Worker[]> {
  try {
    const result = await client.get<ApiResponse<Worker[]>>('/api/worker')
    if (result.data.error) {
      throw new Error(result.data.message)
    }
    return result.data.data!
  } catch (error) {
    throw new Error(onErrorMessage(error))
  }
}

export async function updateWorkerService({
  id,
  data,
}: {
  id: string
  data: Partial<Worker>
}): Promise<Worker> {
  try {
    const result = await client.put<ApiResponse<Worker>>(
      `/api/worker/${id}`,
      data,
    )
    if (result.data.error) {
      throw new Error(result.data.message)
    }
    return result.data.data!
  } catch (error) {
    throw new Error(onErrorMessage(error))
  }
}

export async function deleteWorkerService({
  id,
}: {
  id: string
}): Promise<void> {
  try {
    const result = await client.delete<ApiResponse<null>>(`/api/worker/${id}`)
    if (result.data.error) {
      throw new Error(result.data.message)
    }
    return
  } catch (error) {
    throw new Error(onErrorMessage(error))
  }
}
