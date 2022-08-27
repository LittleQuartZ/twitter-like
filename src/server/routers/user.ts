import { createRouter } from '../createRouter'
import { z } from 'zod'
import { prisma } from '../prisma'
import * as trpc from '@trpc/server'
import { Prisma } from '@prisma/client'
import { registerSchema } from '@/utils/validation/auth'
import { hash } from 'argon2'

export const defaultUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  username: true,
  password: false,
})

export const userRouter = createRouter()
  .mutation('create', {
    input: registerSchema,
    async resolve({ input }) {
      const { username, password } = input
      const hashedPassword = await hash(password)

      try {
        const response = await prisma.user.create({
          data: {
            username,
            password: hashedPassword,
          },
          select: defaultUserSelect,
        })

        return response
      } catch (error: unknown) {
        // Catch prisma conflict error
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2002'
        ) {
          throw new trpc.TRPCError({
            code: 'CONFLICT',
            message: 'Username already exists',
            cause: error,
          })
        } else {
          throw error
        }
      }
    },
  })
  .query('all', {
    async resolve() {
      const response = await prisma.user.findMany({ select: defaultUserSelect })

      return response
    },
  })
  .query('byId', {
    input: z.object({
      id: z.string().uuid(),
    }),
    async resolve({ input }) {
      const response = await prisma.user.findFirst({
        where: { id: input.id },
        select: {
          ...defaultUserSelect,
          followedBy: { select: defaultUserSelect },
          following: { select: defaultUserSelect },
          posts: {
            orderBy: {
              createdAt: 'desc',
            },
            include: {
              author: {
                select: {
                  username: true,
                  id: true,
                },
              },
            },
          },
          likedPosts: true,
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
        if (input.followerId === input.followingId) {
          throw new trpc.TRPCError({
            code: 'BAD_REQUEST',
            message: 'Cannot follow yourself',
          })
        }

        const response = await prisma.user.update({
          where: { id: input.followerId },
          data: {
            following: {
              connect: { id: input.followingId },
            },
          },
          select: defaultUserSelect,
        })

        return response
      } catch (error: unknown) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2025'
        ) {
          throw new trpc.TRPCError({
            code: 'NOT_FOUND',
            message: 'There is no user found with given UUID',
          })
        } else {
          throw error
        }
      }
    },
  })
  .mutation('unfollow', {
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
        if (input.followerId === input.followingId) {
          throw new trpc.TRPCError({
            code: 'BAD_REQUEST',
            message: 'Cannot unfollow yourself',
          })
        }

        const response = await prisma.user.update({
          where: { id: input.followerId },
          data: {
            following: {
              disconnect: { id: input.followingId },
            },
          },
          select: defaultUserSelect,
        })

        return response
      } catch (error: unknown) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2025'
        ) {
          throw new trpc.TRPCError({
            code: 'NOT_FOUND',
            message: 'There is no user found with given UUID',
          })
        } else {
          throw error
        }
      }
    },
  })
