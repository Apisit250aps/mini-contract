import { zodUuid } from '@/lib/zod/field';
import z from 'zod'

export const BaseUser = z.object({
  id: zodUuid(),
  name: z.string().min(4).max(100),
  password: z.string().min(8),
  isActive: z.boolean().default(true),
  lastLogin: z.date().nullable().default(null),
  createdAt: z.date(),
  updatedAt: z.date().default(() => new Date()),
})

export type User = z.infer<typeof BaseUser>
