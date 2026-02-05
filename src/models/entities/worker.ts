import z from 'zod'

export const BaseWorker = z.object({
  id: z.uuid(),
  name: z.string().min(4).max(100),
  position: z.string().min(2).max(50),
  isActive: z.boolean().default(true),
  hiredAt: z.date(),
  createdAt: z.date(),
  updatedAt: z.date().default(() => new Date()),
})

export type Worker = z.infer<typeof BaseWorker>
