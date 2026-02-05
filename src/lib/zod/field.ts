import z from 'zod'
import { uuidv7 } from '@/lib/utils'

export const zodDate = () =>
  z
    .date()
    .or(z.string())
    .transform((val) => (typeof val === 'string' ? new Date(val) : val))
export const zodTimeStamp = () => z.date().default(() => new Date())
export const zodUuid = () => z.uuid().default(() => uuidv7())
