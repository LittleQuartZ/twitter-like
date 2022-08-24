import { trpc } from '@/utils/trpc'
import Post from './Post'

const PostList = () => {
  const { data: posts } = trpc.useQuery(['post.all'])

  if (!posts) {
    // TODO: Create placeholder component
    return <h1>Loading...</h1>
  }

  return (
    <section className='flex flex-col'>
      {posts?.map(post => (
        <Post key={post.id} post={post} />
      ))}
    </section>
  )
}

export default PostList
