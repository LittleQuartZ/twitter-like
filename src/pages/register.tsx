import { IRegister, registerSchema } from '@/utils/validation/auth'
import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { trpc } from '@/utils/trpc'

const Register: NextPage = () => {
  const router = useRouter()

  const { register, handleSubmit } = useForm<IRegister>({
    resolver: zodResolver(registerSchema),
  })

  const { mutateAsync } = trpc.useMutation('user.create')

  const onSubmit = useCallback(
    async (data: IRegister) => {
      const result = await mutateAsync(data)
      if (result.username) {
        router.push('/signin')
      }
    },
    [mutateAsync, router]
  )

  return (
    <div>
      <Head>
        <title>Twitter-like / Register</title>
        <meta name='description' content='Register page' />
      </Head>

      <main>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <h2>Create an account!</h2>
            <input
              type='text'
              placeholder='Username with no symbols'
              {...register('username')}
            />
            <input
              type='password'
              placeholder='A secret password'
              {...register('password')}
            />
            <div>
              <Link href='/signin'>Go to login</Link>
              <button type='submit'>Register</button>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}

export default Register
