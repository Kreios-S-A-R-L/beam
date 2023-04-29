import { serverEnv } from '@/env/server'
import { prisma } from '@/lib/prisma'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { Role } from '@prisma/client'
import { NextAuthOptions } from 'next-auth'
import { unstable_getServerSession } from 'next-auth/next'
import GoogleProvider, { GoogleProfile } from 'next-auth/providers/google'
import { GetServerSidePropsContext } from 'next/types'

const emailRegex = new RegExp(serverEnv.AUTH_EMAIL_REGEX)

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: serverEnv.GOOGLE_CLIENT_ID,
      clientSecret: serverEnv.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ account, ...rest }) {
      if (account?.provider === 'google') {
        const profile = rest.profile as GoogleProfile

        const { email_verified, email } = profile
        return email_verified && emailRegex.test(email)
      }
      return false
    },
    async session({ session, user }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          role: user.role,
        },
      }
    },
  },
  pages: {
    signIn: '/sign-in',
  },
  secret: serverEnv.NEXTAUTH_SECRET,
}

export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext['req']
  res: GetServerSidePropsContext['res']
}) => unstable_getServerSession(ctx.req, ctx.res, authOptions)

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      image?: string | null
      role: Role
    }
  }

  interface User {
    role: Role
  }
}
