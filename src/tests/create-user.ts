import { safeValidate } from '@/lib/utils'
import { BaseUser } from '@/models/entities/user'

async function main() {
  const parsed = await safeValidate(BaseUser, {
    name: 'testuser',
    password: 'password123',
    createdAt: new Date(),
    updatedAt: new Date(),
  })
  if (parsed.error) {
    console.error('Validation Error:', parsed.error)
  } else {
    console.log('Validated User:', parsed.data)
  }
}

main()
