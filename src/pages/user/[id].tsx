import FloatActionButton from '@/components/FAB'
import Post from '@/components/Post'
import { requireAuth } from '@/utils/requireAuth'
import { trpc } from '@/utils/trpc'
import { ArrowLeftIcon } from '@radix-ui/react-icons'
import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'

export const getServerSideProps = requireAuth(async () => {
  return { props: {} }
})

const User: NextPage = () => {
  const router = useRouter()
  const utils = trpc.useContext()
  const { data } = useSession()
  const { id } = router.query

  const authedUser = trpc.useQuery(['user.byId', { id: data?.id as string }])
  const user = trpc.useQuery(['user.byId', { id: id as string }])

  const [followed, setFollowed] = useState<boolean>(
    user.data?.followedBy.some(user => user.id === authedUser.data?.id) || false
  )

  const followMutation = trpc.useMutation('user.follow', {
    onMutate() {
      setFollowed(!followed)
    },
    onSettled() {
      utils.invalidateQueries(['user.byId'])
    },
  })
  const unfollowMutation = trpc.useMutation('user.unfollow', {
    onMutate() {
      setFollowed(!followed)
    },
    onSettled() {
      utils.invalidateQueries(['user.byId'])
    },
  })

  const handleFollow = () => {
    if (followed) {
      unfollowMutation.mutateAsync({
        followerId: authedUser?.data?.id as string,
        followingId: id as string,
      })
    } else {
      followMutation.mutateAsync({
        followerId: authedUser?.data?.id as string,
        followingId: id as string,
      })
    }
  }
  const isLoginUser = user.data?.id === authedUser.data?.id

  return (
    <section>
      <header className='p-4 bg-indigo-200 flex justify-between items-center sticky top-0'>
        <Link passHref href='/'>
          <a className='text-indigo-900 p-2 rounded-md bg-indigo-300 active:-translate-x-2 transition'>
            <ArrowLeftIcon />
          </a>
        </Link>
        <h1
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' })
            utils.invalidateQueries('user.byId')
          }}
          className='text-right fixed left-1/2 -translate-x-1/2 font-bold text-xl text-indigo-900 cursor-pointer'>
          {user.data?.username}
        </h1>
        {!isLoginUser && (
          <button
            className={`text-indigo-500 p-2 px-3 rounded-md border-box ${
              followed ? 'ring-indigo-500 ring-2' : 'bg-indigo-300'
            }`}
            onClick={handleFollow}>
            {followed ? 'Unfollow' : 'Follow'}
          </button>
        )}
      </header>
      <FloatActionButton />
      {isLoginUser
        ? authedUser.data?.posts.map(post => <Post post={post} key={post.id} />)
        : user.data?.posts.map(post => <Post post={post} key={post.id} />)}
    </section>
  )
}

export default User
