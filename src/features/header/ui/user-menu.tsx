'use client'

import { logoutAction } from '@/entities/login'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/shared'
import { useTransition } from 'react'

export function UserMenu({ email }: { email: string | null }) {
  const [isPending, startTransition] = useTransition()

  if (!email) return null

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction()
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type='button'
            className='inline-flex items-center justify-center rounded-lg border border-border w-[150px] bg-background hover:bg-muted h-10 px-4 py-2'
          >
            {email}
          </button>
        }
      />
      <DropdownMenuContent align='end' className='w-56'>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Мой аккаунт</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className='cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50'
            onClick={handleLogout}
            disabled={isPending}
          >
            {isPending ? 'Выход...' : 'Выйти'}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
