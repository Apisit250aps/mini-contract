import { Collection } from 'mongodb'
import { connect } from '@/lib/db/client'
import { User } from '@/models/entities/user'
import { Worker } from '@/models/entities/worker'
import { Contract } from '@/models/entities/contract'
import { Check } from '@/models/entities/check'

let _users: Collection<User> | null = null
let _workers: Collection<Worker> | null = null
let _contracts: Collection<Contract> | null = null
let _checks: Collection<Check> | null = null

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

async function contractsCollection(): Promise<Collection<Contract>> {
  if (!_contracts) {
    const db = await connect()
    _contracts = db.collection<Contract>('contracts')
    await _contracts.createIndexes([
      { key: { title: 1 }, name: 'idx_title' },
      { key: { id: 1 }, unique: true, name: 'uniq_id' },
    ])
  }
  return _contracts
}

async function checksCollection(): Promise<Collection<Check>> {
  if (!_checks) {
    const db = await connect()
    _checks = db.collection<Check>('checks')
    await _checks.createIndexes([
      { key: { contractId: 1 }, name: 'idx_contract_id' },
      { key: { date: 1 }, name: 'idx_date' },
      { key: { id: 1 }, unique: true, name: 'uniq_id' },
      { key: { contractId: 1, date: 1 }, name: 'idx_contract_date' },
    ])
  }
  return _checks
}

export { usersCollection, workersCollection, contractsCollection, checksCollection }
