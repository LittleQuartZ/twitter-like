import { ILogin, loginSchema } from '@/utils/validation/auth'
import type { NextPage } from 'next'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import Head from 'next/head'
import Link from 'next/link'

const SignIn: NextPage = () => {
  const { register, handleSubmit } = useForm<ILogin>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = useCallback(async (data: ILogin) => {
    await signIn('credentials', { ...data, callbackUrl: '/' })
  }, [])

  return (
    <div>
      <Head>
        <title>Twitter-like / Sign-In</title>
        <meta name='description' content='Sign-In page' />
      </Head>

      <main>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div>
              <h2>Welcome Back!</h2>
              <input
                type='text'
                placeholder='type your username'
                {...register('username')}
              />
              <input
                type='password'
                placeholder='type your password'
                {...register('password')}
              />
              <div>
                <Link href='/register'>Go to Register</Link>
                <button type='submit'>Login</button>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}

export default SignIn
