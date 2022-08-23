import { ChatBubbleIcon, HeartIcon, Link1Icon } from '@radix-ui/react-icons'

const formatTime: (date: Date) => string = (date: Date) => {
  const weekday = date.toLocaleDateString('en-US', { weekday: 'short' })
  const time = date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
  })

  const secondsFrom = (new Date().getTime() - date.getTime()) / 1000

  if (secondsFrom < 60) {
    return `${Math.floor(secondsFrom)}s`
  } else if (secondsFrom < 60 * 60) {
    return `${Math.floor(secondsFrom / 60)}m`
  } else if (secondsFrom < 60 * 60 * 24) {
    return `${Math.floor(secondsFrom / 60 / 60)}h`
  }

  return `${weekday}, ${time}`
}

interface Props {
  post: {
    id: number
    content: string
    author: {
      username: string
      id: string
    }
    createdAt: Date
  }
}

const Post: React.FC<Props> = ({ post }) => {
  return (
    <article className='bg-zinc-50 overflow-clip border-b-2 border-indigo-100'>
      <header className='bg-zinc-100 px-4 py-2 flex justify-between'>
        <h1 className='font-bold'>{post.author.username}</h1>
        <span className='text-zinc-400 ml-auto'>
          {formatTime(new Date(post.createdAt))}
        </span>
      </header>

      <main className='p-4'>
        <p>{post.content}</p>
      </main>

      <footer className='px-4 py-2 border-t-2 border-zinc-100 flex items-center gap-4'>
        <span>
          <HeartIcon />
        </span>
        <span>
          <ChatBubbleIcon />
        </span>
        <span className='ml-auto'>
          <Link1Icon />
        </span>
      </footer>
    </article>
  )
}

export default Post
