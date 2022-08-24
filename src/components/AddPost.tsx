import { trpc } from '@/utils/trpc'
import { IPost, postCreateSchema } from '@/utils/validation/post'
import { zodResolver } from '@hookform/resolvers/zod'
import { Cross2Icon } from '@radix-ui/react-icons'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'

interface Props {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const AddPost: React.FC<Props> = ({ setOpen }) => {
  const {
    handleSubmit,
    register,
    setValue,
    setFocus,
    formState: { errors },
  } = useForm<IPost>({
    resolver: zodResolver(postCreateSchema),
  })

  const { data: session } = useSession()
  const { data: userData } = trpc.useQuery([
    'user.byId',
    { id: session?.id as string },
  ])

  useEffect(() => {
    setFocus('content')
  }, [])

  const utils = trpc.useContext()
  const { mutateAsync } = trpc.useMutation('post.create', {
    onMutate(input) {
      const prevPosts = utils.getQueryData(['post.all'])

      utils.setQueryData(['post.all'], (prevPosts: any) => [
        {
          content: input.content,
          authorId: input.authorId,
          author: {
            username: userData?.username,
          },
          createdAt: new Date(),
        },
        ...prevPosts,
      ])

      setOpen(false)

      return { prevPosts }
    },
    onError(_, input, context) {
      utils.setQueryData(['post.all'], context?.prevPosts as any)

      setValue('content', input.content)
      setValue('authorId', input.authorId)
      setOpen(true)
    },
    onSettled() {
      utils.invalidateQueries('post.all')
    },
  })

  setValue('authorId', session?.id as string)

  const onSubmit = useCallback(
    (data: IPost) => {
      mutateAsync(data)
    },
    [mutateAsync]
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
      <textarea
        placeholder='Type something'
        className='h-40 max-h-40 p-4 w-full max-w-full resize-none bg-indigo-50 rounded-md'
        {...register('content')}
      />
      <div className='flex items-stretch gap-4'>
        {Object.values(errors).map((error, index) => (
          <span
            key={index}
            className='text-red-500 bg-red-200 px-4 py-2 rounded-md flex items-center gap-2'>
            <Cross2Icon /> {error.message}
          </span>
        ))}
        <button
          type='submit'
          className='bg-indigo-300 text-indigo-900 px-4 py-2 rounded-md flex-1 font-bold'>
          Post
        </button>
      </div>
    </form>
  )
}

export default AddPost
