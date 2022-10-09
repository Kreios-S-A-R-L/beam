import { getServerAuthSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import * as trpc from '@trpc/server'
import * as trpcNext from '@trpc/server/adapters/next'

export const createContext = async ({
  req,
  res,
}: trpcNext.CreateNextContextOptions) => {
  const session = await getServerAuthSession({ req, res })

  return {
    req,
    res,
    prisma,
    session,
  }
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>
