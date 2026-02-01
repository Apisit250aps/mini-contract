import { safeValidate } from '@/lib/utils'
import { hash } from '@/lib/utils/encryption'
import { BaseUser, User } from '@/models/entities/user'
import { isNil, isUndefined, omitBy } from 'lodash'
import z from 'zod'

const zodUpdatePassword = z.string().transform(async (val) => {
  if (!val || val.trim() === '') return undefined
  return await hash(val)
})
const zodPassword = z.string().transform(async (val) => await hash(val))

async function updateUser(id: string, data: Partial<User>) {
  // const users = await usersCollection()
  // const isExist = await users.findOne({ id })
  // if (!isExist) {
  //   throw new Error('User not found')
  // }
  const parse = await safeValidate(
    BaseUser.extend({ password: zodUpdatePassword }).partial(),
    {
      ...data,
      updatedAt: new Date(),
    },
  )
  if (parse.error) throw new Error(parse.error)

  const set = omitBy(parse.data, isNil)
  console.log('Updating user with data:', set)
}

async function main() {
  const updatedUser = await updateUser('some-uuid-v7-id', {
    name: 'updatedname',
    password: '',
  })
}

main()
