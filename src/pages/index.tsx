import type { NextPage } from 'next'
import { trpc } from '@/utils/trpc'
import { requireAuth } from '@/utils/requireAuth'
import { signOut, useSession } from 'next-auth/react'
import PostList from '@/components/PostList'
import FloatActionButton from '@/components/FAB'
import { useEffect } from 'react'
import Footer from '@/components/Footer'

export const getServerSideProps = requireAuth(async () => {
  return { props: {} }
})

const Index: NextPage = () => {
  const { data: session } = useSession()
  const utils = trpc.useContext()

  const handleScroll = () => {
    if (window.scrollY === 0) {
      utils.invalidateQueries('post.all')
    }
  }

  const handleHeaderClick = () => {
    if (window.scrollY === 0) {
      utils.invalidateQueries('post.all')
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const {
    data: userData,
    isLoading: userDataIsLoading,
    isError,
  } = trpc.useQuery(['user.byId', { id: session?.id as string }])

  if (isError) {
    signOut()
  }

  return (
    <section>
      <header className='p-4 bg-indigo-200 flex justify-between items-center sticky top-0'>
        <h1
          onClick={handleHeaderClick}
          className='font-bold text-xl text-indigo-900 cursor-pointer'>
          {userDataIsLoading
            ? 'Loading...'
            : `Logged in as ${userData?.username}`}
        </h1>
        <button
          onClick={() => signOut()}
          className='py-2 px-4 bg-indigo-300 rounded-md text-indigo-600'>
          Logout
        </button>
      </header>
      <FloatActionButton />
      <PostList />
      <Footer />
    </section>
  )
}

export default Index
