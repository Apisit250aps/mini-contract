import { Collection } from 'mongodb'
import { connect } from '@/lib/db/client'
import { User } from '@/models/entities/user'

let _users: Collection<User> | null = null

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

export { usersCollection }
