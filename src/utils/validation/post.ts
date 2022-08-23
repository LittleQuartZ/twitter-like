import { z } from 'zod'

export const postCreateSchema = z.object({
  content: z
    .string()
    .max(140, { message: 'Max content length reached' })
    .min(1, { message: 'Content cannot be empty' }),
  authorId: z.string().uuid({ message: 'Invalid UUID' }),
})

export type IPost = z.infer<typeof postCreateSchema>
