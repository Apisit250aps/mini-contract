import { NextAuthRequest } from 'next-auth'
import { NextResponse } from 'next/server'

export const isNoAuth = async (req: NextAuthRequest) => {
  const session = req.auth
  if (session) {
    return NextResponse.redirect(new URL('/', req.nextUrl))
  }
}

export const isAuthenticated = async (req: NextAuthRequest) => {
  const session = req.auth
  
  if (!session) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }
}
