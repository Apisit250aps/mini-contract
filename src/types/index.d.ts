
declare module '*.css' {
  const content: string
  export default content
}

type ApiResponse<T = unknown> = {
  success: boolean
  message: string
  data?: T | null
  error?: string | null
}

type PaginatedResult<T> = {
  items: T[]
  total: number
  page: number
  pageSize: number
}
