import { z } from 'zod'

export const loginSchema = z.object({
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
  password: z.string(),
})

export const registerSchema = loginSchema.extend({})

export type ILogin = z.infer<typeof loginSchema>
export type IRegister = z.infer<typeof registerSchema>
