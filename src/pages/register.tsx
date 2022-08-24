import { ILogin, IRegister, registerSchema } from '@/utils/validation/auth'
import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { trpc } from '@/utils/trpc'

import * as LabelPrimitive from '@radix-ui/react-label'
import { ArrowRightIcon, ReloadIcon } from '@radix-ui/react-icons'

const inputClassName =
  'p-4 w-full max-w-full resize-none bg-blue-200 rounded-md placeholder:text-blue-400 focus:ring-2 focus:ring-blue-500 focus:outline-none transition'
const labelClassName =
  'select-none cursor-text absolute text-blue-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-blue-200 px-4 peer-focus:px-4 peer-placeholder-shown:text-blue-400 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1'

const Label = LabelPrimitive.Root

const Register: NextPage = () => {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IRegister>({
    resolver: zodResolver(registerSchema),
    reValidateMode: 'onChange',
  })

  const { mutateAsync, error } = trpc.useMutation('user.create')

  const onSubmit = useCallback(
    async (data: IRegister) => {
      if (!loading) {
        setLoading(true)
        const result = await mutateAsync(data)

        if (result.username) {
          router.push('/signin')
        }
      }
    },
    [mutateAsync, router, setLoading]
  )

  let errorElement

  if (Object.values(errors).length !== 0) {
    errorElement = Object.values(errors).map(({ message }, index) => (
      <p className='w-2/3 p-4 rounded-md bg-red-300' key={index}>
        {message}
      </p>
    ))
  } else if (error) {
    errorElement = (
      <p className='w-2/3 p-4 rounded-md bg-red-300'>{error.shape?.message}</p>
    )
  }

  return (
    <div>
      <Head>
        <title>Twitter-like / Register</title>
        <meta name='description' content='Register page' />
      </Head>

      <main className='w-full h-screen bg-blue-100 flex flex-col items-center gap-6 justify-center'>
        <h2 className='text-2xl font-bold'>Create an account!</h2>
        <form
          className='flex flex-col gap-4 w-2/3'
          onSubmit={handleSubmit(onSubmit)}>
          <fieldset className='relative'>
            <input
              id='username'
              className={inputClassName + ' peer'}
              type='text'
              placeholder='  '
              aria-placeholder=''
              {...register('username')}
            />
            <Label htmlFor='username' className={labelClassName}>
              Username with no symbols
            </Label>
          </fieldset>
          <fieldset className='relative'>
            <input
              id='password'
              className={inputClassName + ' peer'}
              type='password'
              placeholder='   '
              aria-placeholder=''
              {...register('password')}
            />
            <Label htmlFor='password' className={labelClassName}>
              A secret password
            </Label>
          </fieldset>
          <button
            type='submit'
            className='bg-blue-300 text-blue-900 px-4 py-2 rounded-md flex-1 font-bold w-full focus:ring-2 focus:ring-blue-500 focus:outline-none'>
            {loading ? (
              <div className='flex items-center justify-center gap-4'>
                <ReloadIcon className='text-blue-900 animate-twSpin animate-infinite' />{' '}
                Loading...
              </div>
            ) : (
              'Register'
            )}
          </button>
          <Link href='/signin'>
            <a className='text-indigo-500 focus:underline hover:underline hover:font-bold focus:outline-none focus:font-bold ml-auto group'>
              Already have an account? Login{' '}
              <ArrowRightIcon className='inline group-hover:animate-slideOutRight group-hover:animate-infinite group-hover:animate-distance-1 group-hover:animate-alternate' />
            </a>
          </Link>
        </form>
        {errorElement}
      </main>
    </div>
  )
}

export default Register
