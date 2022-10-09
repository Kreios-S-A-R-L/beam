import type { AppRouter } from '@/server/routers/_app'
import { createReactQueryHooks, createTRPCClient } from '@trpc/react'
import type { inferProcedureInput, inferProcedureOutput } from '@trpc/server'
import superjson from 'superjson'

export const getBaseUrl = () => {
  if (process.browser) return ''
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return `http://localhost:${process.env.PORT ?? 3000}`
}

export const transformer = superjson

export const trpc = createReactQueryHooks<AppRouter>()

export const trpcClient = createTRPCClient<AppRouter>({
  url: `${getBaseUrl()}/api/trpc`,
  transformer,
})

export type TQuery = keyof AppRouter['_def']['queries']

export type InferQueryOutput<TRouteKey extends TQuery> = inferProcedureOutput<
  AppRouter['_def']['queries'][TRouteKey]
>

export type InferQueryInput<TRouteKey extends TQuery> = inferProcedureInput<
  AppRouter['_def']['queries'][TRouteKey]
>

export type InferQueryPathAndInput<TRouteKey extends TQuery> = [
  TRouteKey,
  Exclude<InferQueryInput<TRouteKey>, void>
]
