import { NextAuthOptions } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { verify } from 'argon2'

import { prisma } from './prisma'
import { loginSchema } from '@/utils/validation/auth'

export const nextAuthOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        username: {
          label: 'Email',
          type: 'text',
          placeholder: 'user_nam3',
        },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async credentials => {
        // login logic goes here
        const creds = await loginSchema.parseAsync(credentials)

        const user = await prisma.user.findFirst({
          where: { username: creds.username },
        })

        if (!user) {
          return null
        }

        const isValidPassword = await verify(user.password, creds.password)

        if (!isValidPassword) {
          return null
        }

        return user
      },
    }),
  ],
  callbacks: {
    jwt: async ({ user, token }) => {
      if (user) {
        token.id = user.id
      }

      return token
    },
    session: async ({ token, session }) => {
      if (token) {
        session.id = token.id
      }

      return session
    },
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 15 * 24 * 60 * 30,
  },
  pages: {
    signIn: '/signin',
    newUser: '/register',
  },
}
