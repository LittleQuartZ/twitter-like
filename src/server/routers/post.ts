import { createRouter } from '../createRouter'
import { z } from 'zod'
import { prisma } from '../prisma'
import * as trpc from '@trpc/server'
import { postSchema } from '@/utils/validation/post'

export const postRouter = createRouter()
  .mutation('create', {
    input: postSchema,
    async resolve({ input }) {
      const response = await prisma.post.create({
        data: { content: input.content, authorId: input.authorId },
      })

      return response
    },
  })
  .query('all', {
    async resolve() {
      const response = await prisma.post.findMany()

      if (!response) {
        throw new trpc.TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        })
      }

      return response
    },
  })
  .query('byId', {
    input: z.object({
      id: z.number().min(1),
    }),
    async resolve({ input }) {
      const response = await prisma.post.findFirst({
        where: { id: input.id },
        include: {
          author: { select: { id: true, username: true } },
        },
      })

      if (!response) {
        throw new trpc.TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        })
      }

      return response
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
      userId: z.string().uuid({ message: 'Invalid UUID' }),
    }),
    async resolve({ input }) {
      const response = await prisma.post.deleteMany({
        where: { id: input.id, authorId: input.userId },
      })

      if (response.count === 0) {
        throw new trpc.TRPCError({
          code: 'NOT_FOUND',
          message: `Not found your post with id: ${input.id}`,
        })
      }

      return response
    },
  })
