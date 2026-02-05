import { zodDate, zodTimeStamp, zodUuid } from '@/lib/zod/field'
import z from 'zod'

export const BaseContract = z.object({
  id: zodUuid(),
  title: z.string().min(1).max(255),
  description: z.string().max(1024).optional(),
  employer: z.string().max(255).optional(),
  startDate: zodDate().optional(),
  endDate: zodDate().optional(),
  isActive: z.boolean().default(true),
  workers: z.array(z.uuid()).default([]).optional(),
  size: z.number().default(1).optional(),
  createdAt: z.date(),
  updatedAt: zodTimeStamp(),
})

export type Contract = z.infer<typeof BaseContract>
