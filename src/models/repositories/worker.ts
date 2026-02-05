import { workersCollection } from '@/lib/mongo'
import { safeValidate, uuidv7 } from '@/lib/utils'
import { BaseWorker, Worker } from '@/models/entities/worker'

async function createWorker(worker: Worker): Promise<Worker> {
  const workers = await workersCollection()
  const parsed = await safeValidate(BaseWorker, {
    ...worker,
    id: uuidv7(),
    createdAt: new Date(),
  })
  if (parsed.error) {
    throw new Error(parsed.error)
  }
  const result = await workers.insertOne(parsed.data!)
  if (!result.acknowledged) {
    throw new Error('Failed to create worker')
  }
  return parsed.data!
}

async function updateWorker(
  id: string,
  worker: Partial<Worker>,
): Promise<Worker | null> {
  const workers = await workersCollection()
  const isExist = await workers.findOne({ id })
  if (!isExist) {
    throw new Error('Worker not found')
  }
  const parsed = await safeValidate(BaseWorker.omit({ id: true }).partial(), {
    ...worker,
    updatedAt: new Date(),
  })
  if (parsed.error) {
    throw new Error(parsed.error)
  }
  const result = await workers.findOneAndUpdate(
    { id },
    {
      $set: parsed.data!,
    },
    { returnDocument: 'after', projection: { password: 0, _id: 0 } },
  )
  if (!result) {
    throw new Error('Failed to update worker')
  }
  return result
}

async function deleteWorker(id: string): Promise<void> {
  const workers = await workersCollection()
  const result = await workers.deleteOne({ id })
  if (result.deletedCount === 0) {
    throw new Error('Failed to delete worker')
  }
}

async function getWorkerById(id: string): Promise<Worker | null> {
  const workers = await workersCollection()
  const worker = await workers.findOne({ id }, { projection: { _id: 0 } })
  return worker
}

async function getAllWorkers(): Promise<Worker[]> {
  const workers = await workersCollection()
  const allWorkers = await workers
    .find({}, { projection: { _id: 0 } })
    .toArray()
  return allWorkers
}

export {
  createWorker,
  updateWorker,
  deleteWorker,
  getWorkerById,
  getAllWorkers,
}
