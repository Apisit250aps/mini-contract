import { zodDate, zodTimeStamp, zodUuid } from '@/lib/zod/field'
import z from 'zod'

export const BaseCheck = z.object({
  id: zodUuid(),
  contractId: z.uuid(),
  date: zodDate(),
  workersChecked: z.array(z.uuid()).default([]),
  weight: z.number().min(0).default(0),
  rate: z.number().min(0).default(0),
  amount: z.number().min(0).default(0),
  createdAt: zodDate(),
  updatedAt: zodTimeStamp(),
})

export type Check = z.infer<typeof BaseCheck>
