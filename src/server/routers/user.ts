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
        include: { following: true, followedBy: true },
      })

      return response
    },
  })
  .mutation('follow', {
    input: z.object({
      followerId: z
        .string({
          required_error: 'Need a followerId',
          invalid_type_error: 'followerId must be a string',
        })
        .uuid({ message: 'followerId must be a valid UUID' }),
      followingId: z
        .string({
          required_error: 'Need a followingId',
          invalid_type_error: 'followingId must be a string',
        })
        .uuid({ message: 'followingId must be a valid UUID' }),
    }),
    async resolve({ input }) {
      try {
        const response = await prisma.$transaction([
          prisma.user.update({
            where: { id: input.followerId },
            data: {
              following: {
                connect: { id: input.followingId },
              },
            },
          }),
          prisma.user.update({
            where: { id: input.followingId },
            data: {
              followedBy: {
                connect: { id: input.followerId },
              },
            },
          }),
        ])

        return response
      } catch (error: unknown) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2025'
        ) {
          // The .code property can be accessed in a type-safe manner
          throw new trpc.TRPCError({
            code: 'BAD_REQUEST',
            message: 'There is no user found with given UUID',
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
