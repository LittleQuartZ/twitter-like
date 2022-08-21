import { createRouter } from '../createRouter'
import { z, ZodError } from 'zod'
import { prisma } from '../prisma'
import * as trpc from '@trpc/server'
import { Prisma } from '@prisma/client'

export const userRouter = createRouter()
  .mutation('create', {
    input: z.object({
      username: z
        .string({
          required_error: 'Username is required',
        })
        .regex(/^[A-Za-z0-9_]+$/, {
          message: 'Username must only contains letters and numbers',
        })
        .max(20, {
          message: 'Username must be less than 20 characters',
        })
        .min(5, {
          message: 'Username must be at least 5 characters',
        }),
    }),
    async resolve({ input }) {
      try {
        const response = await prisma.user.create({
          data: {
            username: input.username,
          },
        })

        return response
      } catch (error: unknown) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2002'
        ) {
          // The .code property can be accessed in a type-safe manner
          throw new trpc.TRPCError({
            code: 'BAD_REQUEST',
            message: 'Username already exists',
          })
        } else if (error instanceof ZodError) {
          throw new trpc.TRPCError({
            code: 'BAD_REQUEST',
            message: 'Invalid input',
            cause: error,
          })
        } else {
          throw new trpc.TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Internal server error',
            cause: error,
          })
        }
      }
    },
  })
  .query('find', {
    input: z.object({
      username: z.string().optional(),
    }),
    async resolve({ input }) {
      const response = await prisma.user.findMany({
        where: { username: input.username || undefined },
      })

      return response
    },
  })
