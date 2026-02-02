declare module '*.css' {
  const content: string
  export default content
}

declare module '*.scss' {
  const content: string
  export default content
}

export type ApiResponse<T = unknown> = {
  success: boolean
  message: string
  data?: T | null
  error?: string | null
}

export type PaginatedResult<T> = {
  items: T[]
  total: number
  page: number
  pageSize: number
}
