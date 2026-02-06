import client from '@/lib/client'
import { onErrorMessage } from '@/lib/utils'
import { Contract, ContractDetail } from '@/models/entities/contract'

export async function createContractService({
  data,
}: {
  data: Partial<Contract>
}): Promise<Contract> {
  try {
    const result = await client.post<ApiResponse<Contract>>('/api/contract', data)
    if (result.data.error) {
      throw new Error(result.data.message)
    }
    return result.data.data!
  } catch (error) {
    throw new Error(onErrorMessage(error))
  }
}

export async function getContractService({
  id,
}: {
  id: string
}): Promise<ContractDetail> {
  try {
    const result = await client.get<ApiResponse<ContractDetail>>(`/api/contract/${id}`)
    if (result.data.error) {
      throw new Error(result.data.message)
    }
    return result.data.data!
  } catch (error) {
    throw new Error(onErrorMessage(error))
  }
}

export async function getAllContractService(): Promise<Contract[]> {
  try {
    const result = await client.get<ApiResponse<Contract[]>>('/api/contract')
    if (result.data.error) {
      throw new Error(result.data.message)
    }
    return result.data.data!
  } catch (error) {
    throw new Error(onErrorMessage(error))
  }
}

export async function updateContractService({
  id,
  data,
}: {
  id: string
  data: Partial<Contract>
}): Promise<Contract> {
  try {
    const result = await client.put<ApiResponse<Contract>>(`/api/contract/${id}`, data)
    if (result.data.error) {
      throw new Error(result.data.message)
    }
    return result.data.data!
  } catch (error) {
    throw new Error(onErrorMessage(error))
  }
}

export async function deleteContractService({
  id,
}: {
  id: string
}): Promise<void> {
  try {
    const result = await client.delete<ApiResponse<null>>(`/api/contract/${id}`)
    if (result.data.error) {
      throw new Error(result.data.message)
    }
  } catch (error) {
    throw new Error(onErrorMessage(error))
  }
}