import type { NextPage } from 'next'
import { trpc } from '@/utils/trpc'
import { useState } from 'react'

const Index: NextPage = () => {
  // states
  const [usernameInput, setUsernameInput] = useState<string>('')
  const [contentInput, setContentInput] = useState<string>('')
  const [usernameSearch, setUsernameSearch] = useState<string>('')
  const [deletePostId, setDeletePostId] = useState<number>(1)

  // hooks
  const utils = trpc.useContext()
  const userCreateMutation = trpc.useMutation('user.create', {
    onSuccess() {
      utils.invalidateQueries(['user.find'])
    },
  })
  const userFollowMutation = trpc.useMutation('user.follow', {
    onSuccess() {
      utils.invalidateQueries(['user.find'])
    },
  })
  const postCreateMutation = trpc.useMutation('post.create', {
    onSuccess() {
      utils.invalidateQueries(['post.find'])
    },
  })
  const postDeleteMutation = trpc.useMutation('post.delete', {
    onSuccess() {
      utils.invalidateQueries(['post.find'])
    },
  })
  const { data: userData } = trpc.useQuery([
    'user.find',
    { username: undefined },
  ])
  const { data: postData } = trpc.useQuery(['post.find', { id: undefined }])

  const [followId, followedId] = [
    '9f883b59-e9a6-4221-ac0d-06cadcc2cf9e',
    '18ed6f74-03e6-4dad-bfa5-e5d655d776a5',
  ]

  // Submit handler for user creation
  const createUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    userCreateMutation.mutate({ username: usernameInput })
  }

  const createPost = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    postCreateMutation.mutate({
      content: contentInput,
      authorId: '3f075d01-cf58-48d5-9f19-3240b509db70',
    })
  }

  const deletePost = (id: number) => {
    postDeleteMutation.mutate({ id })
  }

  const followUser = () => {
    userFollowMutation.mutate({ followerId: followId, followingId: followedId })
  }

  // Error handling, should probably make a new component
  let errorElement
  if (userCreateMutation.error?.data?.zodError) {
    errorElement = (
      <div>{userCreateMutation.error.data.zodError.fieldErrors.username}</div>
    )
  } else if (userCreateMutation.error?.shape?.message) {
    errorElement = <div>{userCreateMutation.error.shape.message}</div>
  }

  return (
    <div>
      <form onSubmit={createUser}>
        <input
          type='text'
          value={usernameInput}
          onChange={e => setUsernameInput(e.target.value)}
          placeholder='username'
        />
        <button type='submit'>Add</button>

        <input
          type='text'
          value={usernameSearch}
          onChange={e => setUsernameSearch(e.target.value)}
        />

        <br />
      </form>
      {userData && userData.length !== 0 ? (
        userData
          .filter(user =>
            // case-insensitive filter by username if usernameSearch is set
            user.username.toLowerCase().includes(usernameSearch.toLowerCase())
          )
          .map(user => <h1 key={user.id}>{user.username}</h1>)
      ) : (
        <h1>No users found</h1>
      )}
      <button type='button' onClick={() => followUser()}>
        FOLLOW
      </button>

      <form onSubmit={createPost}>
        <input
          type='text'
          value={contentInput}
          onChange={e => setContentInput(e.target.value)}
          placeholder='content'
        />
        <button type='submit'>Post</button>
      </form>
      {postData && postData.length !== 0 ? (
        postData.map(post => (
          <div>
            <p key={post.id}>
              {post.content} <b>{post.author.username}</b>
            </p>
            <button onClick={() => deletePost(post.id)}>DELETE</button>
          </div>
        ))
      ) : (
        <h1>No posts found</h1>
      )}

      <form onSubmit={() => deletePost(deletePostId)}>
        <input
          type='number'
          value={deletePostId}
          onChange={e => setDeletePostId(Number(e.target.value))}
          placeholder='post id to delete'
        />
        <button type='submit'>delete</button>
      </form>

      {errorElement}
      <button type='button' onClick={() => console.table(userData)}>
        CHECK
      </button>
    </div>
  )
}

export default Index
