import { checksCollection } from '@/lib/mongo'
import { safeValidate, uuidv7 } from '@/lib/utils'
import { BaseCheck, Check } from '@/models/entities/check'

/**
 * Get all checks
 */
export async function getChecks(): Promise<Check[]> {
  const collection = await checksCollection()
  return collection.find({}, { projection: { _id: 0 } }).toArray()
}

/**
 * Get check by ID
 */
export async function getCheckById(id: string): Promise<Check | null> {
  const collection = await checksCollection()
  const check = await collection.findOne({ id }, { projection: { _id: 0 } })
  return check || null
}

/**
 * Get checks by contract ID
 */
export async function getChecksByContractId(contractId: string): Promise<Check[]> {
  const collection = await checksCollection()
  return collection
    .find({ contractId }, { projection: { _id: 0 } })
    .sort({ date: -1 })
    .toArray()
}

/**
 * Get checks by date range
 */
export async function getChecksByDateRange(
  startDate: Date,
  endDate: Date,
): Promise<Check[]> {
  const collection = await checksCollection()
  return collection
    .find(
      {
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      },
      { projection: { _id: 0 } }
    )
    .sort({ date: -1 })
    .toArray()
}

/**
 * Get checks by contract ID and date range
 */
export async function getChecksByContractAndDateRange(
  contractId: string,
  startDate: Date,
  endDate: Date,
): Promise<Check[]> {
  const collection = await checksCollection()
  return collection
    .find(
      {
        contractId,
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      },
      { projection: { _id: 0 } }
    )
    .sort({ date: -1 })
    .toArray()
}

/**
 * Get latest check for a contract
 */
export async function getLatestCheckByContractId(
  contractId: string,
): Promise<Check | null> {
  const collection = await checksCollection()
  const check = await collection.findOne(
    { contractId },
    {
      projection: { _id: 0 },
      sort: { date: -1 },
    }
  )
  return check || null
}

/**
 * Check if a worker was checked on a specific date for a contract
 */
export async function isWorkerChecked(
  contractId: string,
  workerId: string,
  date: Date,
): Promise<boolean> {
  const collection = await checksCollection()
  const startOfDay = new Date(date)
  startOfDay.setHours(0, 0, 0, 0)
  
  const endOfDay = new Date(date)
  endOfDay.setHours(23, 59, 59, 999)

  const check = await collection.findOne({
    contractId,
    workersChecked: { $in: [workerId] },
    date: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  })

  return !!check
}

/**
 * Create a new check
 */
export async function createCheck(
  check: Omit<Check, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<Check> {
  const collection = await checksCollection()
  const parsed = await safeValidate(BaseCheck, {
    ...check,
    id: uuidv7(),
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  if (parsed.error || !parsed.data) {
    throw new Error(parsed.error || 'Validation failed')
  }

  const result = await collection.insertOne(parsed.data)
  if (!result.acknowledged) {
    throw new Error('Failed to create check')
  }

  return parsed.data
}

/**
 * Update a check
 */
export async function updateCheck(
  id: string,
  check: Partial<Omit<Check, 'id' | 'createdAt' | 'updatedAt'>>,
): Promise<Check | null> {
  const collection = await checksCollection()
  const existing = await getCheckById(id)
  if (!existing) {
    throw new Error('Check not found')
  }

  const parsed = await safeValidate(
    BaseCheck.omit({ id: true, createdAt: true }).partial(),
    { ...check, updatedAt: new Date() }
  )

  if (parsed.error || !parsed.data) {
    throw new Error(parsed.error || 'Validation failed')
  }

  const update = await collection.findOneAndUpdate(
    { id },
    { $set: parsed.data },
    { returnDocument: 'after', projection: { _id: 0 } }
  )

  if (!update) {
    throw new Error('Failed to update check')
  }

  return update
}

/**
 * Add workers to an existing check
 */
export async function addWorkersToCheck(
  id: string,
  workerIds: string[],
): Promise<Check | null> {
  const collection = await checksCollection()
  const existing = await getCheckById(id)
  if (!existing) {
    throw new Error('Check not found')
  }

  // Remove duplicates and merge with existing workers
  const uniqueWorkers = Array.from(
    new Set([...existing.workersChecked, ...workerIds])
  )

  const update = await collection.findOneAndUpdate(
    { id },
    { 
      $set: { 
        workersChecked: uniqueWorkers,
        updatedAt: new Date(),
      } 
    },
    { returnDocument: 'after', projection: { _id: 0 } }
  )

  if (!update) {
    throw new Error('Failed to update check')
  }

  return update
}

/**
 * Remove workers from an existing check
 */
export async function removeWorkersFromCheck(
  id: string,
  workerIds: string[],
): Promise<Check | null> {
  const collection = await checksCollection()
  const existing = await getCheckById(id)
  if (!existing) {
    throw new Error('Check not found')
  }

  // Remove specified workers
  const updatedWorkers = existing.workersChecked.filter(
    (workerId) => !workerIds.includes(workerId)
  )

  const update = await collection.findOneAndUpdate(
    { id },
    { 
      $set: { 
        workersChecked: updatedWorkers,
        updatedAt: new Date(),
      } 
    },
    { returnDocument: 'after', projection: { _id: 0 } }
  )

  if (!update) {
    throw new Error('Failed to update check')
  }

  return update
}

/**
 * Delete a check
 */
export async function deleteCheck(id: string): Promise<boolean> {
  const collection = await checksCollection()
  const result = await collection.deleteOne({ id })
  return result.deletedCount === 1
}

/**
 * Delete all checks for a contract
 */
export async function deleteChecksByContractId(contractId: string): Promise<number> {
  const collection = await checksCollection()
  const result = await collection.deleteMany({ contractId })
  return result.deletedCount
}

/**
 * Get check statistics for a contract
 */
export async function getCheckStatistics(contractId: string): Promise<{
  totalChecks: number
  lastCheckDate: Date | null
  averageWorkersPerCheck: number
}> {
  const collection = await checksCollection()
  
  const stats = await collection
    .aggregate([
      { $match: { contractId } },
      {
        $group: {
          _id: null,
          totalChecks: { $sum: 1 },
          lastCheckDate: { $max: '$date' },
          averageWorkersPerCheck: { 
            $avg: { $size: '$workersChecked' } 
          },
        },
      },
    ])
    .toArray()

  if (stats.length === 0) {
    return {
      totalChecks: 0,
      lastCheckDate: null,
      averageWorkersPerCheck: 0,
    }
  }

  return {
    totalChecks: stats[0].totalChecks,
    lastCheckDate: stats[0].lastCheckDate,
    averageWorkersPerCheck: Math.round(stats[0].averageWorkersPerCheck * 100) / 100,
  }
}