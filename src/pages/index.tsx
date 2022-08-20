import type { NextPage } from 'next'
import { trpc } from '@/utils/trpc'
import { useState } from 'react'
import { User } from '@prisma/client'

const Index: NextPage = () => {
  // states
  const [usernameInput, setUsernameInput] = useState<string>('')
  const [usernameSearch, setUsernameSearch] = useState<string>('')

  // hooks
  const utils = trpc.useContext()
  const mutation = trpc.useMutation('user.create', {
    onSuccess: () => {
      utils.refetchQueries(['user.find'])
    },
  })
  const { data } = trpc.useQuery([
    'user.find',
    { username: usernameSearch || undefined },
  ])

  // Submit handler for user creation
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    mutation.mutate({ username: usernameInput })
  }

  // Error handling, should probably make a new component
  let errorElement
  if (mutation.error?.data?.zodError) {
    errorElement = (
      <div>{mutation.error.data.zodError.fieldErrors.username}</div>
    )
  } else if (mutation.error?.shape?.message) {
    errorElement = <div>{mutation.error.shape.message}</div>
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          value={usernameInput}
          onChange={e => setUsernameInput(e.target.value)}
        />
        <button type='submit'>Add</button>
      </form>

      <input
        type='text'
        value={usernameSearch}
        onChange={e => setUsernameSearch(e.target.value)}
      />

      <br />
      {data && data.length !== 0 ? (
        data.map((user: User) => <h1 key={user.id}>{user.username}</h1>)
      ) : (
        <h1>No users found</h1>
      )}
      {errorElement}
    </div>
  )
}

export default Index
