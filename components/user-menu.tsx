'use client'

import { signOut, useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

export function UserMenu() {
  const { data: session } = useSession()

  if (!session?.user?.email) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <button
          type='button'
          className='inline-flex w-full items-center justify-center rounded-lg border border-border bg-background hover:bg-muted hover:text-foreground text-sm font-medium whitespace-nowrap transition-all outline-none select-none size-7 gap-1 px-2.5 text-[0.8rem]'
        >
          {session.user.email}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-56'>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Мой аккаунт</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className='cursor-pointer text-red-600 focus:text-red-600'
            onClick={() => signOut({ callbackUrl: '/login' })}
          >
            Выйти
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
