import { auth } from '@/auth'
import { useMiddlewares } from '@/lib/middlewares'
import { isAuthenticated } from './lib/middlewares/auth'

export default auth((req) =>
  useMiddlewares(req, [
    {
      paths: ['/dashboard/*'],
      middlewares: [isAuthenticated],
    },
  ]),
)
// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
