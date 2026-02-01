import z from 'zod'
import { isNil, omitBy } from 'lodash'

import { usersCollection } from '@/lib/mongo'
import { safeValidate } from '@/lib/utils'
import { hash } from '@/lib/utils/encryption'
import { BaseUser, User } from '@/models/entities/user'

const zodUpdatePassword = z.string().transform(async (val) => {
  if (!val || val.trim() === '') return undefined
  return await hash(val)
})
const zodPassword = z.string().transform(async (val) => await hash(val))

async function createUser(data: User): Promise<User | null> {
  const users = await usersCollection()
  const parse = await safeValidate(BaseUser.extend({ password: zodPassword }), {
    ...data,
    isActive: true,
    lastLogin: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  if (parse.error) throw new Error(parse.error)

  const isUnique = await users.findOne({ name: parse.data!.name })
  if (isUnique) {
    throw new Error('Username already exists')
  }
  const password = await hash(parse.data!.password)
  const result = await users.insertOne({
    ...parse.data!,
    password,
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

export { createUser, updateUser }
