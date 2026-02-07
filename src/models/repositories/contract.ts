import { contractsCollection } from '@/lib/mongo'
import { safeValidate, uuidv7 } from '@/lib/utils'
import {
  BaseContract,
  Contract,
  ContractDetail,
} from '@/models/entities/contract'
import { sortBy } from 'lodash'

export async function getContracts(): Promise<Contract[]> {
  const collection = await contractsCollection()
  return collection.find({}, { projection: { _id: 0 } }).toArray()
}

export async function getContractById(
  id: string,
): Promise<ContractDetail | null> {
  const collection = await contractsCollection()
  const [contract] = await collection
    .aggregate<ContractDetail>([
      { $match: { id } },
      {
        $lookup: {
          from: 'workers',
          localField: 'workers',
          foreignField: 'id',
          as: 'workersDetail',
          pipeline: [{ $project: { _id: 0 } }],
        },
      },
      {
        $lookup: {
          from: 'checks',
          localField: 'id',
          foreignField: 'contractId',
          as: 'checked',
          pipeline: [{ $project: { _id: 0 } }, { $sort: { date: 1 } }],
        },
      },
      { $project: { _id: 0 } },
    ])
    .toArray()
  return contract || null
}

export async function createContract(
  contract: Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<Contract> {
  const collection = await contractsCollection()
  const parsed = await safeValidate(BaseContract, {
    ...contract,
    id: uuidv7(),
    createdAt: new Date(),
    updatedAt: new Date(),
  })
  if (parsed.error || !parsed.data) {
    throw new Error(parsed.error || 'Validation failed')
  }
  const result = await collection.insertOne(parsed.data)
  if (!result.acknowledged) {
    throw new Error('Failed to create contract')
  }
  return parsed.data
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
    BaseContract.omit({ id: true, createdAt: true }).partial(),
    { ...contract, updatedAt: new Date() },
  )
  if (parsed.error || !parsed.data) {
    throw new Error(parsed.error || 'Validation failed')
  }
  const update = await collection.findOneAndUpdate(
    { id },
    { $set: parsed.data },
    { returnDocument: 'after', projection: { _id: 0 } },
  )
  if (!update) {
    throw new Error('Failed to update contract')
  }
  return update
}

export async function deleteContract(id: string): Promise<boolean> {
  const collection = await contractsCollection()
  const result = await collection.deleteOne({ id })
  return result.deletedCount === 1
}
