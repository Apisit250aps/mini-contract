import { Collection } from 'mongodb'
import { connect } from '@/lib/db/client'
import { User } from '@/models/entities/user'
import { Worker } from '@/models/entities/worker'

let _users: Collection<User> | null = null
let _workers: Collection<Worker> | null = null

async function usersCollection(): Promise<Collection<User>> {
  if (!_users) {
    const db = await connect()
    _users = db.collection<User>('users')
    await _users.createIndexes([
      { key: { name: 1 }, unique: true, name: 'uniq_name' },
      { key: { id: 1 }, unique: true, name: 'uniq_id' },
    ])
  }
  return _users
}

async function workersCollection(): Promise<Collection<Worker>> {
  if (!_workers) {
    const db = await connect()
    _workers = db.collection<Worker>('workers')
    await _workers.createIndexes([
      { key: { name: 1 }, unique: true, name: 'uniq_name' },
      { key: { id: 1 }, unique: true, name: 'uniq_id' },
    ])
  }
  return _workers
}

export { usersCollection, workersCollection }
