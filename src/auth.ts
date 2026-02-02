import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { userLogin } from './models/repositories/user'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        name: { label: 'Name' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const { name, password } = credentials as {
          name: string
          password: string
        }

        const auth = await userLogin({ name, password })

        return auth
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.name = user.name
        token.isActive = user.isActive
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.name = token.name as string
        session.user.isActive = token.isActive as boolean
      }
      return session
    },
  },
})
