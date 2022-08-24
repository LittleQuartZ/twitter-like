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
  .mutation('update', {
    input: z.object({
      id: z.number().min(1),
      data: z.object({
        content: z
          .string()
          .max(140, { message: 'Max content length reached' })
          .min(1, { message: 'Content cannot be empty' })
          .nullish(),
        authorId: z.string().uuid({ message: 'Invalid UUID' }).nullish(),
        likedBy: z
          .object({
            id: z.string().uuid().nullish(),
            like: z.boolean().nullish(),
          })
          .nullish(),
      }),
    }),
    async resolve({ input }) {
      try {
        const like = input.data.likedBy?.like ? 'connect' : 'disconnect'

        const response = await prisma.post.update({
          where: { id: input.id },
          data: {
            content: input.data.content || undefined,
            authorId: input.data.authorId || undefined,
            likedBy:
              {
                [like]:
                  {
                    id: input.data.likedBy?.id || undefined,
                  } || undefined,
              } || undefined,
          },
        })

        return response
      } catch (error: unknown) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2025'
        ) {
          throw new trpc.TRPCError({
            code: 'NOT_FOUND',
            message: 'There is no post found with given id',
          })
        } else {
          throw error
        }
      }
    },
  })
