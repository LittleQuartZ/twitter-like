/**
 * This file contains the root router of your tRPC-backend
 */
import { ZodError } from 'zod'
import { createRouter } from '../createRouter'
import { postRouter } from './post'
import { userRouter } from './user'

/**
 * Create your application's root router
 * If you want to use SSG, you need export this
 * @link https://trpc.io/docs/ssg
 * @link https://trpc.io/docs/router
 */
export const appRouter = createRouter()
  /**
   * Optionally do custom error (type safe!) formatting
   * @link https://trpc.io/docs/error-formatting
   */
  // .formatError(({ shape, error }) => { })
  .formatError(({ shape, error }) => {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.code === 'BAD_REQUEST' && error.cause instanceof ZodError
            ? error.cause.flatten()
            : null,
      },
    }
  })
  /**
   * Merge `postRouter` under `post.`
   */
  .merge('user.', userRouter)
  .merge('post.', postRouter)

export type AppRouter = typeof appRouter
