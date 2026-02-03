import z from 'zod'
import { isNil, omit, omitBy } from 'lodash'

import { usersCollection } from '@/lib/mongo'
import { safeValidate } from '@/lib/utils'
import { hash, verify } from '@/lib/utils/encryption'
import { BaseUser, User } from '@/models/entities/user'

const zodUpdatePassword = z.string().transform(async (val) => {
  if (!val || val.trim() === '') return undefined
  return await hash(val)
})
const zodPassword = z.string().transform(async (val) => await hash(val))

async function createUser(
  data: Pick<User, 'name' | 'password' | 'isActive'>,
): Promise<User | null> {
  const users = await usersCollection()
  const parse = await safeValidate(BaseUser.extend({ password: zodPassword }), {
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  if (parse.error) throw new Error(parse.error)

  const result = await users.insertOne({
    ...parse.data!,
  })
  if (!result.acknowledged) {
    throw new Error('Failed to create user')
  }
  return parse.data!
}

async function updateUser(
  id: string,
  user: Partial<User>,
): Promise<User | null> {
  const users = await usersCollection()
  const isExist = await users.findOne({ id })
  if (!isExist) {
    throw new Error('User not found')
  }
  const parse = await safeValidate(
    BaseUser.omit({ id: true })
      .extend({ password: zodUpdatePassword })
      .partial(),
    {
      ...user,
      updatedAt: new Date(),
    },
  )
  if (parse.error) throw new Error(parse.error)
  const data = omitBy(parse.data, isNil)
  const result = await users.findOneAndUpdate(
    { id },
    {
      $set: data,
    },
    {
      returnDocument: 'after',
      projection: { password: 0, _id: 0 },
    },
  )
  if (!result) {
    throw new Error('Failed to update user')
  }
  return result
}

async function deleteUser(id: string): Promise<boolean> {
  const users = await usersCollection()
  const result = await users.deleteOne({ id })
  return result.deletedCount === 1
}

async function getUserById(id: string): Promise<User | null> {
  const users = await usersCollection()
  const user = await users.findOne(
    { id },
    { projection: { password: 0, _id: 0 } },
  )
  return user
}

async function getUserByName(name: string): Promise<User | null> {
  const users = await usersCollection()
  const user = await users.findOne(
    { name },
    { projection: { password: 0, _id: 0 } },
  )
  return user
}

async function getAllUser() {
  const users = await usersCollection()
  const list = await users
    .find({}, { projection: { password: 0, _id: 0 } })
    .toArray()
  return list
}

async function userLogin({
  name,
  password,
}: {
  name: string
  password: string
}): Promise<Omit<User, 'password'> | null> {
  const users = await usersCollection()
  const user = await users.findOne({ name })
  if (!user) return null

  const isValid = await verify(user.password, password)

  if (!isValid) return null
  await updateUser(user.id, { lastLogin: new Date() })
  const auth = omit(user, ['password', '_id'])
  return auth
}

export {
  createUser,
  updateUser,
  deleteUser,
  getUserById,
  getUserByName,
  getAllUser,
  userLogin,
}
