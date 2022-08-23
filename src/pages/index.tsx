import type { NextPage } from 'next'
import { trpc } from '@/utils/trpc'
import { useState } from 'react'
import { requireAuth } from '@/utils/requireAuth'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'

export const getServerSideProps = requireAuth(async () => {
  return { props: {} }
})

const Index: NextPage = () => {
  const { data } = useSession()
  const reloadSession = () => {
    const event = new Event('visibilitychange')
    document.dispatchEvent(event)
  }

  // states
  const [usernameInput, setUsernameInput] = useState<string>('')
  const [passwordInput, setPasswordInput] = useState<string>('')
  const [contentInput, setContentInput] = useState<string>('')

  // hooks
  const utils = trpc.useContext()
  const userCreateMutation = trpc.useMutation('user.create', {
    onSuccess() {
      utils.invalidateQueries(['user.all'])
    },
  })
  const userFollowMutation = trpc.useMutation('user.follow')
  const postCreateMutation = trpc.useMutation('post.create', {
    onSuccess() {
      utils.invalidateQueries(['post.all'])
    },
  })
  const postDeleteMutation = trpc.useMutation('post.delete', {
    onSuccess() {
      utils.invalidateQueries(['post.all'])
    },
  })
  const { data: users } = trpc.useQuery(['user.all'])
  const { data: posts } = trpc.useQuery(['post.all'])
  const authedUser = trpc.useQuery(['user.byId', { id: data?.id as string }])

  // Submit handler for user creation
  const createUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    userCreateMutation.mutateAsync({
      username: usernameInput,
      password: passwordInput,
    })
  }

  const createPost = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    postCreateMutation.mutateAsync({
      content: contentInput,
      authorId: authedUser?.data?.id as string,
    })
  }

  const followUser = (id: string) => {
    if (authedUser.isError) {
      signOut()
    }

    userFollowMutation.mutateAsync({
      followerId: authedUser.data?.id as string,
      followingId: id,
    })
  }

  const deletePost = (id: number) => {
    if (authedUser.isError) {
      signOut()
    }

    postDeleteMutation.mutateAsync({
      id,
      userId: authedUser.data?.id as string,
    })
  }

  // Error handling, should probably make a new component
  let errorElement
  if (userCreateMutation.error?.data?.zodError) {
    errorElement = (
      <p>
        {Object.entries(userCreateMutation.error.data.zodError.fieldErrors).map(
          ([key, value]) => (
            <p>
              {key}: {value?.join(', ')}
            </p>
          )
        )}
      </p>
    )
  } else if (userCreateMutation.error?.shape?.message) {
    errorElement = <div>{userCreateMutation.error.shape.message}</div>
  }

  return (
    <div>
      {authedUser.data && <h1>{authedUser.data.username}</h1>}
      <form onSubmit={createUser}>
        <input
          type='text'
          value={usernameInput}
          onChange={e => setUsernameInput(e.target.value)}
          placeholder='username'
        />
        <input
          type='text'
          value={passwordInput}
          onChange={e => setPasswordInput(e.target.value)}
          placeholder='password'
        />
        <button type='submit'>Add</button>
      </form>

      {users?.map(user => (
        <article key={user.id}>
          <h1>{user.username}</h1>
          <Link href={`/user/${user.id}`}>goto page</Link>
          <button onClick={() => followUser(user.id)}>Follow</button>
        </article>
      ))}

      <form onSubmit={createPost}>
        <input
          type='text'
          placeholder='content'
          value={contentInput}
          onChange={e => setContentInput(e.target.value)}
        />
        <button type='submit'>Post</button>
      </form>

      {posts?.map(post => (
        <article key={post.id}>
          <p>{post.content}</p>
          <button type='button' onClick={() => deletePost(post.id)}>
            DELETE
          </button>
        </article>
      ))}

      {errorElement}
      {userFollowMutation.error?.message && (
        <h2>{userFollowMutation.error.message}</h2>
      )}
      <button type='button' onClick={() => console.table(userFollowMutation)}>
        CHECK
      </button>
      <button type='button' onClick={() => signOut()}>
        Logout
      </button>
    </div>
  )
}

export default Index
