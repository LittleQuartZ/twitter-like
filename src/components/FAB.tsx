import { Cross1Icon, Pencil1Icon, PlusIcon } from '@radix-ui/react-icons'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import React, { useState } from 'react'
import AddPost from './AddPost'

const Popover = PopoverPrimitive.Root
const PopoverTrigger = PopoverPrimitive.Trigger
const PopoverContent = PopoverPrimitive.Content

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogContent = DialogPrimitive.Content
const DialogTitle = DialogPrimitive.Title
const DialogClose = DialogPrimitive.Close

const popoverButtonClass =
  'inline-flex items-center justify-center p-6 bg-indigo-300 text-indigo-900 rounded-full shadow-lg'

const popoverContentClass =
  'motion-safe:radix-state-open:animate-fadeInUp motion-safe:radix-state-open:animate-ease-[0.16, 1, 0.3, 1] motion-safe:radix-state-open:animate-duration-200 p-2 -z-10'

const FloatActionButton = () => {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <div className='fixed bottom-4 right-4'>
      <Popover>
        <PopoverTrigger className={popoverButtonClass + ' group'}>
          <PlusIcon className='group-radix-state-open:rotate-45 transition-transform' />
        </PopoverTrigger>
        <PopoverContent className={popoverContentClass}>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className={popoverButtonClass}>
              <Pencil1Icon />
            </DialogTrigger>
            <DialogPrimitive.DialogPortal>
              <DialogPrimitive.DialogOverlay className='bg-zinc-900 opacity-50 fixed inset-0 motion-safe:animate-fadeIn motion-safe:animate-ease-in-quad motion-safe:animate-duration-200' />
              <DialogContent className='flex flex-col rounded-lg shadow-lg gap-4 p-4 bg-indigo-200 w-4/5 fixed bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2'>
                <header className='flex justify-between items-center px-2'>
                  <DialogTitle className='text-lg'>New Post</DialogTitle>
                  <DialogClose className='hover:text-red-500 rounded-full'>
                    <Cross1Icon />
                  </DialogClose>
                </header>
                <AddPost setOpen={setOpen} />
              </DialogContent>
            </DialogPrimitive.DialogPortal>
          </Dialog>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default FloatActionButton
