import { z } from 'zod'

export const loginSchema = z.object({
  username: z
    .string({
      required_error: 'Username is required',
    })
    .min(1, {
      message: 'Username cannot be empty',
    })
    .max(20, {
      message: 'Username must be less than 20 characters',
    })
    .regex(/^[A-Za-z0-9_]+$/, {
      message: 'Username must only contains letters and numbers',
    }),
  password: z.string().min(1, { message: 'Password cannot be empty' }),
})

export const registerSchema = loginSchema.extend({})

export type ILogin = z.infer<typeof loginSchema>
export type IRegister = z.infer<typeof registerSchema>
