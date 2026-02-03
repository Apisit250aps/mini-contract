import { AxiosError } from 'axios'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import z from 'zod'

export { v7 as uuidv7 } from 'uuid'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function zodError<T>(error: z.ZodError<T>): string {
  return `Field ${error.issues[0].path.join('.')}! ${error.issues[0].message}`
}

export async function safeValidate<T>(
  schema: z.ZodType<T>,
  payload: unknown,
): Promise<{ data: T | null; error: string | null }> {
  const { data, error } = await schema.safeParseAsync(payload)
  return { data: data ?? null, error: error ? zodError(error) : null }
}

export function onErrorMessage(error: unknown): string {
  if (error instanceof z.ZodError) {
    return zodError(error)
  } else if (error instanceof AxiosError) {
    console.log('Axios Error Response:', error.response)
    return (
      (error.response?.data.error as string) || 'An unexpected error occurred.'
    )
  } else if (typeof error === 'string') {
    return error
  }
  return 'An unexpected error occurred.'
}
