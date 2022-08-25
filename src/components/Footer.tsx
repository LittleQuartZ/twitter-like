import { GitHubLogoIcon } from '@radix-ui/react-icons'

const Footer = () => {
  return (
    <footer className='bg-indigo-400 p-2 flex justify-center'>
      <a
        className='flex bg-zinc-200 w-fit items-center gap-2 px-2 py-1 transition rounded-lg focus:ring-zinc-500 focus:ring-2'
        href='https://github.com/littlequartz/twitter-like'
        target='_blank'>
        <GitHubLogoIcon className='inline' /> GitHub
      </a>
    </footer>
  )
}

export default Footer
