import { createRouter } from '../createRouter'
import { z } from 'zod'
import { prisma } from '../prisma'
import * as trpc from '@trpc/server'
import { postCreateSchema } from '@/utils/validation/post'
import { Prisma } from '@prisma/client'
import { defaultUserSelect } from './user'

export const defaultPostSelect = Prisma.validator<Prisma.PostSelect>()({
  id: true,
  content: true,
  createdAt: true,
  author: {
    select: defaultUserSelect,
  },
})

export const postRouter = createRouter()
  .mutation('create', {
    input: postCreateSchema,
    async resolve({ input }) {
      const response = await prisma.post.create({
        data: { content: input.content, authorId: input.authorId },
        select: defaultPostSelect,
      })

      return response
    },
  })
  .query('all', {
    async resolve() {
      const response = await prisma.post.findMany({
        select: defaultPostSelect,
        orderBy: { createdAt: 'desc' },
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
  .query('byId', {
    input: z.object({
      id: z.number().min(1),
    }),
    async resolve({ input }) {
      const response = await prisma.post.findFirst({
        where: { id: input.id },
        select: defaultPostSelect,
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
  .mutation('like', {
    input: z.object({
      id: z
        .number({
          required_error: 'Id is required',
          invalid_type_error: 'Id must be a number greater than 1',
        })
        .min(1),
      userId: z
        .string({
          required_error: 'Need a user id',
          invalid_type_error: 'user id must be a string',
        })
        .uuid({ message: 'user id must be a valid UUID' }),
      like: z.boolean(),
    }),
    async resolve({ input }) {
      let response

      input.like
        ? (response = await prisma.post.update({
            where: { id: input.id },
            data: { likedBy: { connect: { id: input.userId } } },
          }))
        : (response = await prisma.post.update({
            where: { id: input.id },
            data: { likedBy: { disconnect: { id: input.userId } } },
          }))

      return response
    },
  })
