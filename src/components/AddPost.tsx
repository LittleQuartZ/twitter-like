import { trpc } from '@/utils/trpc'
import { IPost, postCreateSchema } from '@/utils/validation/post'
import { zodResolver } from '@hookform/resolvers/zod'
import { Cross2Icon } from '@radix-ui/react-icons'
import { useSession } from 'next-auth/react'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'

interface Props {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const AddPost: React.FC<Props> = ({ setOpen }) => {
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<IPost>({
    resolver: zodResolver(postCreateSchema),
  })

  const { data: session } = useSession()

  const utils = trpc.useContext()
  const { mutateAsync } = trpc.useMutation('post.create', {
    onSuccess() {
      utils.invalidateQueries('post.all')
    },
  })

  setValue('authorId', session?.id as string)

  const onSubmit = useCallback(
    async (data: IPost) => {
      await mutateAsync(data)
      setOpen(false)
    },
    [mutateAsync, setOpen]
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
