import { trpc } from '@/utils/trpc'
import { ReloadIcon } from '@radix-ui/react-icons'
import Post from './Post'

const PostList = () => {
  const { data: posts } = trpc.useQuery(['post.all'])

  return (
    <section className='flex flex-col'>
      {posts ? (
        posts?.map(post => <Post key={post.id} post={post} />)
      ) : (
        <ReloadIcon className='animate-twSpin animate-infinite absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-1/2' />
      )}
    </section>
  )
}

export default PostList
