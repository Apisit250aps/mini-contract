import { auth } from '@/auth'
import { useMiddlewares } from '@/lib/middlewares'

export default auth((req) => useMiddlewares(req, []))
// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
