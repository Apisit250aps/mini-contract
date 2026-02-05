import { contractsCollection } from '@/lib/mongo'
import { safeValidate } from '@/lib/utils'
import { BaseContract, Contract } from '@/models/entities/contract'

export async function getContracts(): Promise<Contract[]> {
  const collection = await contractsCollection()
  return collection.find({}, { projection: { _id: 0 } }).toArray()
}

export async function getContractById(id: string): Promise<Contract | null> {
  const collection = await contractsCollection()
  return collection.findOne({ id }, { projection: { _id: 0 } })
}

export async function createContract(
  contract: Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<Contract> {
  const collection = await contractsCollection()
  const parsed = await safeValidate(
    BaseContract.omit({ id: true, createdAt: true, updatedAt: true }),
    {
      ...contract,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  )
  if (parsed.error && !parsed.data) {
    throw new Error(parsed.error)
  }
  await collection.insertOne(parsed.data as Contract)
  return parsed.data as Contract
}

export async function updateContract(
  id: string,
  contract: Partial<Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>>,
): Promise<Contract | null> {
  const collection = await contractsCollection()
  const existing = await getContractById(id)
  if (!existing) {
    throw new Error('Contract not found')
  }
  const parsed = await safeValidate(
    BaseContract.omit({ id: true, createdAt: true, updatedAt: true }),
    { ...contract, updatedAt: new Date() },
  )
  if (parsed.error && !parsed.data) {
    throw new Error(parsed.error)
  }
  const update = await collection.findOneAndUpdate(
    { id },
    { $set: parsed.data! },
    { returnDocument: 'after', projection: { _id: 0 } },
  )
  return update
}

export async function deleteContract(id: string): Promise<boolean> {
  const collection = await contractsCollection()
  const result = await collection.deleteOne({ id })
  return result.deletedCount === 1
}
