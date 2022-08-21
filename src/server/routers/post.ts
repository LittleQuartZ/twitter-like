import { createRouter } from '../createRouter'
import { z, ZodError } from 'zod'
import { prisma } from '../prisma'
import * as trpc from '@trpc/server'
import { Prisma } from '@prisma/client'

export const postRouter = createRouter()
  .mutation('create', {
    input: z.object({
      content: z
        .string()
        .max(140, { message: 'Max content length reached' })
        .min(1, { message: 'Content cannot be empty' }),
      authorId: z.string().uuid({ message: 'Invalid UUID' }),
    }),
    async resolve({ input }) {
      try {
        const response = await prisma.post.create({
          data: { content: input.content, authorId: input.authorId },
        })

        return response
      } catch (error: unknown) {
        if (error instanceof ZodError) {
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
      id: z.number().min(1).optional(),
    }),
    async resolve({ input }) {
      try {
        const response = await prisma.post.findMany({
          where: { id: input.id || undefined },
          include: {
            author: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        })

        return response
      } catch (error: unknown) {
        if (error instanceof ZodError) {
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
  .mutation('delete', {
    input: z.object({
      id: z
        .number({
          required_error: 'Id is required',
          invalid_type_error: 'Id must be a number greater than 1',
        })
        .min(1),
    }),
    async resolve({ input }) {
      try {
        const response = await prisma.post.delete({ where: { id: input.id } })

        return response
      } catch (error: unknown) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2025'
        ) {
          throw new trpc.TRPCError({
            code: 'NOT_FOUND',
            message: `Not found any post with id: ${input.id}`,
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
