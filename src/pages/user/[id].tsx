import { trpc } from '@/utils/trpc'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'

const User = () => {
  const router = useRouter()
  const utils = trpc.useContext()
  const { data } = useSession()
  const { id } = router.query

  const authedUser = trpc.useQuery(['user.byId', { id: data?.id as string }])
  const user = trpc.useQuery(['user.byId', { id: id as string }])
  const followMutation = trpc.useMutation('user.follow', {
    onSuccess() {
      utils.invalidateQueries(['user.byId'])
    },
  })
  const unfollowMutation = trpc.useMutation('user.unfollow', {
    onSuccess() {
      utils.invalidateQueries(['user.byId'])
    },
  })

  const follow = () => {
    followMutation.mutateAsync({
      followerId: authedUser?.data?.id as string,
      followingId: id as string,
    })
  }

  const unfollow = () => {
    unfollowMutation.mutateAsync({
      followerId: authedUser?.data?.id as string,
      followingId: id as string,
    })
  }

  return (
    <div>
      <h1>{user.data?.username}</h1>
      <span>
        Following: {user.data?.following.length} | Followers:{' '}
        {user.data?.followedBy.length}
      </span>
      {user.data?.id !== authedUser.data?.id && (
        <>
          {user.data?.followedBy.find(
            user => user.id === authedUser.data?.id
          ) ? (
            <button onClick={unfollow}>Unfollow</button>
          ) : (
            <button onClick={follow}>Follow</button>
          )}
        </>
      )}
      {user.data?.posts.map(post => (
        <article key={post.id}>
          <p>{post.content}</p>
        </article>
      ))}
      <Link href='/'>Back to index</Link>
    </div>
  )
}

export default User
