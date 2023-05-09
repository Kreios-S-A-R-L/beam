import { commentRouter } from './comment'
import { imageRouter } from './image'
import { postRouter } from './post'
import { userRouter } from './user'

import { createTRPCRouter } from '@/server/api/trpc'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  comment: commentRouter,
  user: userRouter,
  image: imageRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
