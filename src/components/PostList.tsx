import { trpc } from '@/utils/trpc'
import { User, Post as PostModel } from '@prisma/client'
import Post from './Post'

interface Props {
  userData:
    | {
        username: string
        id: string
        followedBy: User[]
        following: User[]
        posts: PostModel[]
        likedPosts: PostModel[]
      }
    | undefined
}

const PostList: React.FC<Props> = ({ userData }) => {
  const { data: posts } = trpc.useQuery(['post.all'])

  if (!posts) {
    // TODO: Create placeholder component
    return <h1>Loading...</h1>
  }

  return (
    <section className='flex flex-col'>
      {posts?.map(post => (
        <Post
          key={post.id}
          post={post}
          liked={
            userData?.likedPosts.filter(likedPost => likedPost.id === post.id)
              .length === 1
          }
          userId={userData?.id as string}
        />
      ))}
    </section>
  )
}

export default PostList
