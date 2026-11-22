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
      <DropdownMenuTrigger render={<Button variant='outline' size='sm' />}>
        {session.user.email}
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
