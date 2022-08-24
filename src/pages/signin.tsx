import { ILogin, loginSchema } from '@/utils/validation/auth'
import type { NextPage } from 'next'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import Head from 'next/head'
import Link from 'next/link'
import * as LabelPrimitive from '@radix-ui/react-label'
import { useRouter } from 'next/router'
import { ArrowRightIcon, ReloadIcon } from '@radix-ui/react-icons'

const Label = LabelPrimitive.Root

const inputClassName =
  'p-4 w-full max-w-full resize-none bg-indigo-200 rounded-md placeholder:text-indigo-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition'
const labelClassName =
  'select-none cursor-text absolute text-indigo-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-indigo-200 px-4 peer-focus:px-4 peer-placeholder-shown:text-indigo-400 peer-focus:text-indigo-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1'

const SignIn: NextPage = () => {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)

  const { register, handleSubmit } = useForm<ILogin>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = useCallback(async (data: ILogin) => {
    if (!loading) {
      setLoading(true)
      await signIn('credentials', { ...data, callbackUrl: '/' })
    }
  }, [])

  return (
    <div>
      <Head>
        <title>Twitter-like / Sign-In</title>
        <meta name='description' content='Sign-In page' />
      </Head>

      <main className='w-full h-screen bg-indigo-100 flex flex-col items-center gap-6 justify-center'>
        <header className='text-center'>
          <h2 className='text-2xl font-bold'>Welcome Back!</h2>
          <h3>Please Login</h3>
        </header>
        <form
          className='flex flex-col gap-4 w-2/3'
          onSubmit={handleSubmit(onSubmit)}>
          <fieldset className='relative'>
            <input
              type='text'
              id='username'
              placeholder='  '
              aria-placeholder=''
              className={inputClassName + ' peer'}
              {...register('username')}
            />
            <Label htmlFor='username' className={labelClassName}>
              Username
            </Label>
          </fieldset>
          <fieldset className='relative'>
            <input
              type='password'
              id='password'
              placeholder='  '
              aria-placeholder=''
              className={inputClassName + ' peer'}
              {...register('password')}
            />
            <Label htmlFor='password' className={labelClassName}>
              Password
            </Label>
          </fieldset>
          <div>
            <button
              type='submit'
              className='bg-indigo-300 text-indigo-900 px-4 py-2 rounded-md flex-1 font-bold w-full focus:ring-2 focus:ring-indigo-500 focus:outline-none'>
              {loading ? (
                <div className='flex items-center justify-center gap-4'>
                  <ReloadIcon className='text-indigo-900 animate-twSpin animate-infinite' />{' '}
                  Loading...
                </div>
              ) : (
                'Login'
              )}
            </button>
          </div>
          <Link href='/register'>
            <a className='text-indigo-500 focus:underline hover:underline hover:font-bold focus:outline-none focus:font-bold ml-auto group'>
              Don&apos;t have an account? Register{' '}
              <ArrowRightIcon className='inline group-hover:animate-slideOutRight group-hover:animate-infinite group-hover:animate-distance-1 group-hover:animate-alternate' />
            </a>
          </Link>
        </form>
        {router.query.error && (
          <p className='w-2/3 p-4 rounded-md bg-red-300'>
            {router.query.error === 'CredentialsSignin' &&
              "Something's wrong with your input"}
          </p>
        )}
      </main>
    </div>
  )
}

export default SignIn
