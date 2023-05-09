import { appRouter } from '@/server/routers/_app'
import { createNextApiHandler } from '@trpc/server/adapters/next'
import { createTRPCContext } from '@/server/api/trpc'

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
  batching: {
    enabled: true,
  },
  onError:
    process.env.NODE_ENV === 'development'
      ? ({ path, error }) => {
          console.error(
            `❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`
          )
        }
      : undefined,
})
