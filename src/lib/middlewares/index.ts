
import { NextAuthRequest } from 'next-auth'
import { NextResponse } from 'next/server';

export type MiddlewareGroup = {
  prefix?: string
  paths?: string[]
  middlewares: Array<
    (req: NextAuthRequest) => Promise<NextResponse | void | null> | NextResponse | void | null
  >
}

export async function useMiddlewares(
  req: NextAuthRequest,
  groups: MiddlewareGroup[],
): Promise<NextResponse> {
  const pathname = req.nextUrl.pathname

  for (const group of groups) {
    const isMatch =
      (group.prefix && pathname.startsWith(group.prefix)) ||
      (group.paths && group.paths.includes(pathname)) ||
      (group.paths &&
        group.paths.some((path) =>
          path.endsWith('/*')
            ? pathname.startsWith(path.slice(0, -2))
            : pathname === path,
        ))

    if (isMatch) {
      for (const middleware of group.middlewares) {
        const response = await middleware(req)
        if (response) return response
      }
    }
  }
  return NextResponse.next()
}
