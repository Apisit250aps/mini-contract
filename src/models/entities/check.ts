import { zodTimeStamp, zodUuid } from '@/lib/zod/field'
import z from 'zod'

export const BaseCheck = z.object({
  id: zodUuid(),
  contractId: z.uuid(),
  date: z.date(),
  workersChecked: z.array(z.uuid()).default([]),
  createdAt: z.date(),
  updatedAt: zodTimeStamp(),
})

export type Check = z.infer<typeof BaseCheck>
