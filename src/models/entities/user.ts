import { uuidv7 } from '@/lib/utils'
import z from 'zod'

export const BaseUser = z.object({
  id: z.uuid().default(uuidv7()),
  name: z.string().min(4).max(100),
  password: z.string().min(8),
  isActive: z.boolean().default(true),
  lastLogin: z.date().nullable().default(null),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
})

export type User = z.infer<typeof BaseUser>
