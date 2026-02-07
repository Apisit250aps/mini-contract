import { zodDate, zodTimeStamp, zodUuid } from '@/lib/zod/field'
import z from 'zod'

export const BaseCheck = z.object({
  id: zodUuid(),
  contractId: z.uuid(),
  date: zodDate(),
  workersChecked: z.array(z.uuid()).default([]),
  createdAt: zodDate(),
  updatedAt: zodTimeStamp(),
})

export type Check = z.infer<typeof BaseCheck>
