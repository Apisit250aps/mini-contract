import client from '@/lib/client'
import { onErrorMessage } from '@/lib/utils'
import { Check } from '@/models/entities/check'

export async function createCheckService({
  data,
}: {
  data: Partial<Check>
}): Promise<Check> {
  try {
    const result = await client.post<ApiResponse<Check>>('/api/check', data)
    if (result.data.error) {
      throw new Error(result.data.message)
    }
    return result.data.data!
  } catch (error) {
    throw new Error(onErrorMessage(error))
  }
}

export async function updateCheckService({
  checkId,
  workerId,
  isChecked,
}: {
  checkId: string
  workerId: string
  isChecked: boolean
}): Promise<Check> {
  try {
    const endpoint = isChecked
      ? `/api/check/${checkId}/add-worker`
      : `/api/check/${checkId}/remove-worker`

    const result = await client.post<ApiResponse<Check>>(endpoint, {
      workerIds: [workerId],
    })

    if (result.data.error) {
      throw new Error(result.data.message)
    }
    return result.data.data!
  } catch (error) {
    throw new Error(onErrorMessage(error))
  }
}

export async function getCheckStatsService({
  contractId,
}: {
  contractId: string
}): Promise<{
  totalChecks: number
  lastCheckDate: Date | null
  averageWorkersPerCheck: number
}> {
  try {
    const result = await client.get<
      ApiResponse<{
        totalChecks: number
        lastCheckDate: Date | null
        averageWorkersPerCheck: number
      }>
    >(`/api/check/stats/${contractId}`)

    if (result.data.error) {
      throw new Error(result.data.message)
    }
    return result.data.data!
  } catch (error) {
    throw new Error(onErrorMessage(error))
  }
}

export async function deleteCheckService({
  checkId,
}: {
  checkId: string
}): Promise<void> {
  try {
    const result = await client.delete<ApiResponse<null>>(
      `/api/check/${checkId}`,
    )
    if (result.data.error) {
      throw new Error(result.data.message)
    }
    return
  } catch (error) {
    throw new Error(onErrorMessage(error))
  }
}

export async function editCheckService({
  checkId,
  data,
}: {
  checkId: string
  data: Partial<Check>
}): Promise<Check> {
  try {
    const result = await client.put<ApiResponse<Check>>(
      `/api/check/${checkId}`,
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
