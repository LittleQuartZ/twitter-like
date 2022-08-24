import type { NextPage } from 'next'
import { trpc } from '@/utils/trpc'
import { requireAuth } from '@/utils/requireAuth'
import { signOut, useSession } from 'next-auth/react'
import PostList from '@/components/PostList'
import FloatActionButton from '@/components/FAB'

export const getServerSideProps = requireAuth(async () => {
  return { props: {} }
})

const Index: NextPage = () => {
  const { data: session } = useSession()

  const { data: userData, isLoading: userDataIsLoading } = trpc.useQuery([
    'user.byId',
    { id: session?.id as string },
  ])

  // states
  // const [usernameInput, setUsernameInput] = useState<string>('')
  // const [passwordInput, setPasswordInput] = useState<string>('')
  // const [contentInput, setContentInput] = useState<string>('')
  //
  // // hooks
  // const utils = trpc.useContext()
  // const userCreateMutation = trpc.useMutation('user.create', {
  //   onSuccess() {
  //     utils.invalidateQueries(['user.all'])
  //   },
  // })
  // const userFollowMutation = trpc.useMutation('user.follow')
  // const postCreateMutation = trpc.useMutation('post.create', {
  //   onSuccess() {
  //     utils.invalidateQueries(['post.all'])
  //   },
  // })
  // const postDeleteMutation = trpc.useMutation('post.delete', {
  //   onSuccess() {
  //     utils.invalidateQueries(['post.all'])
  //   },
  // })
  // const { data: users } = trpc.useQuery(['user.all'])
  // const { data: posts } = trpc.useQuery(['post.all'])
  // const authedUser = trpc.useQuery(['user.byId', { id: data?.id as string }])
  //
  // // Submit handler for user creation
  // const createUser = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault()
  //
  //   userCreateMutation.mutateAsync({
  //     username: usernameInput,
  //     password: passwordInput,
  //   })
  // }
  //
  // const createPost = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault()
  //
  //   postCreateMutation.mutateAsync({
  //     content: contentInput,
  //     authorId: authedUser?.data?.id as string,
  //   })
  // }
  //
  // const followUser = (id: string) => {
  //   if (authedUser.isError) {
  //     signOut()
  //   }
  //
  //   userFollowMutation.mutateAsync({
  //     followerId: authedUser.data?.id as string,
  //     followingId: id,
  //   })
  // }
  //
  // const deletePost = (id: number) => {
  //   if (authedUser.isError) {
  //     signOut()
  //   }
  //
  //   postDeleteMutation.mutateAsync({
  //     id,
  //     userId: authedUser.data?.id as string,
  //   })
  // }
  //
  // // Error handling, should probably make a new component
  // let errorElement
  // if (userCreateMutation.error?.data?.zodError) {
  //   errorElement = (
  //     <p>
  //       {Object.entries(userCreateMutation.error.data.zodError.fieldErrors).map(
  //         ([key, value]) => (
  //           <p>
  //             {key}: {value?.join(', ')}
  //           </p>
  //         )
  //       )}
  //     </p>
  //   )
  // } else if (userCreateMutation.error?.shape?.message) {
  //   errorElement = <div>{userCreateMutation.error.shape.message}</div>
  // }

  if (userDataIsLoading) {
    // TODO: Create placeholder component
    return <h1>Loading...</h1>
  }

  return (
    <section>
      <header className='p-4 bg-indigo-200 flex justify-between items-center'>
        <h1 className='font-bold text-xl text-indigo-900'>
          Logged in as {userData?.username}
        </h1>
        <button
          onClick={() => signOut()}
          className='py-2 px-4 bg-indigo-300 rounded-md text-indigo-600'>
          Logout
        </button>
      </header>
      <PostList />
      <FloatActionButton />
    </section>
  )
}

export default Index
